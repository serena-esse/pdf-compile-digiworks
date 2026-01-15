<?php
session_start();

/** CORS (DEV + PROD) */
$allowed_origins = [
  'https://pdf.digiworks.it',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin && in_array($origin, $allowed_origins, true)) {
  header("Access-Control-Allow-Origin: $origin");
  header("Vary: Origin");
}
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

function loadDbConfig(): array {
  $local = __DIR__ . '/../config.local.php';
  $prod  = __DIR__ . '/../config.prod.php';
  if (file_exists($local)) return require $local;
  return require $prod;
}

function connectDB(): PDO {
  $cfg = loadDbConfig();
  $dsn = "mysql:host={$cfg['host']};port=" . ($cfg['port'] ?? 3306) . ";dbname={$cfg['db']};charset=" . ($cfg['charset'] ?? 'utf8mb4');
  return new PDO($dsn, $cfg['user'], $cfg['pass'], [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
  ]);
}

try {
  if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Metodo non valido. Usa POST."]);
    exit;
  }

  $data = json_decode(file_get_contents('php://input'), true);
  if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Formato JSON non valido."]);
    exit;
  }

  // id opzionale (se presente -> UPDATE)
  $id = $data['id'] ?? null;
  if ($id !== null && !ctype_digit((string)$id)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "ID non valido"]);
    exit;
  }

  // obbligatori
  foreach (['nome', 'cognome', 'data_nascita', 'codice_fiscale'] as $campo) {
    if (empty($data[$campo])) {
      http_response_code(400);
      echo json_encode(["status" => "error", "message" => "Il campo '$campo' è obbligatorio."]);
      exit;
    }
  }

  // campi reali della tabella
  $fields = [
    "nome", "cognome", "data_nascita", "indirizzo", "codice_fiscale",
    "email", "telefono", "località", "Provincia", "luogo_di_nascita",
    "cap", "data_pratica", "ragione_sociale", "sdi_pec", "numero_carta_identita",
    "numero_da_migrare1", "codice_di_migrazione1", "Operatore_Cedente1", "tipologia1",
    "numero_da_migrare2", "codice_di_migrazione2", "Operatore_Cedente2", "tipologia2",
    "numero_da_migrare3", "codice_di_migrazione3", "Operatore_Cedente3", "tipologia3",
    "note", "luogo_pratica", "rilasciato_da",
    "n_revoip1000", "n_revoipchagg", "costo_attivazione", "canone_mensile"
  ];

  // normalizza ("" -> NULL)
  $payload = [];
  foreach ($fields as $f) {
    $payload[$f] = (isset($data[$f]) && $data[$f] !== "") ? $data[$f] : null;
  }

  $pdo = connectDB();

  // Se UPDATE: controlla che il cliente esista
  if ($id !== null) {
    $chk = $pdo->prepare("SELECT 1 FROM `clienti` WHERE `id` = :id");
    $chk->execute(['id' => (int)$id]);
    if (!$chk->fetchColumn()) {
      echo json_encode(["status" => "error", "message" => "Cliente non trovato"]);
      exit;
    }

    // Se cambio CF, deve restare unico
    $chkCf = $pdo->prepare("SELECT 1 FROM `clienti` WHERE `codice_fiscale` = :cf AND `id` <> :id");
    $chkCf->execute(['cf' => $payload['codice_fiscale'], 'id' => (int)$id]);
    if ($chkCf->fetchColumn()) {
      echo json_encode(["status" => "error", "message" => "Codice fiscale già presente"]);
      exit;
    }

    // UPDATE
    $set = [];
    foreach ($fields as $f) {
      $set[] = "`$f` = :$f";
    }

    $sql = "UPDATE `clienti` SET " . implode(", ", $set) . " WHERE `id` = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(array_merge($payload, ['id' => (int)$id]));

    echo json_encode(["status" => "success", "message" => "Cliente aggiornato", "id" => (int)$id]);
    exit;
  }

  // INSERT: CF deve essere unico
  $chkCf = $pdo->prepare("SELECT 1 FROM `clienti` WHERE `codice_fiscale` = :cf");
  $chkCf->execute(['cf' => $payload['codice_fiscale']]);
  if ($chkCf->fetchColumn()) {
    echo json_encode(["status" => "error", "message" => "Codice fiscale già presente"]);
    exit;
  }

  $cols = implode(", ", array_map(fn($f) => "`$f`", $fields));
  $vals = implode(", ", array_map(fn($f) => ":$f", $fields));
  $sql = "INSERT INTO `clienti` ($cols) VALUES ($vals)";
  $stmt = $pdo->prepare($sql);
  $stmt->execute($payload);

  $newId = (int)$pdo->lastInsertId();
  echo json_encode(["status" => "success", "message" => "Cliente creato", "id" => $newId]);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(["status" => "error", "message" => "Errore server", "debug" => $e->getMessage()]);
}
