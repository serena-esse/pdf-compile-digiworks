<?php
declare(strict_types=1);
session_start();

/** ---- CORS (DEV + PROD) ---- */
$allowed_origins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://pdf.digiworks.it",
];
$origin = $_SERVER["HTTP_ORIGIN"] ?? "";
if ($origin && in_array($origin, $allowed_origins, true)) {
  header("Access-Control-Allow-Origin: $origin");
  header("Vary: Origin");
}
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=utf-8");

if (($_SERVER["REQUEST_METHOD"] ?? "") === "OPTIONS") {
  http_response_code(204);
  exit;
}
if (($_SERVER["REQUEST_METHOD"] ?? "") !== "POST") {
  http_response_code(405);
  echo json_encode(["status" => "error", "message" => "Metodo non valido, usa POST"]);
  exit;
}

/** ---- DB config local/prod ---- */
function loadDbConfig(): array {
  $local = __DIR__ . "/../config.local.php";
  $prod  = __DIR__ . "/../config.prod.php";
  if (file_exists($local)) return require $local;
  return require $prod;
}
function connectDB(): PDO {
  $cfg = loadDbConfig();
  $host = $cfg["host"];
  $db   = $cfg["db"];
  $user = $cfg["user"];
  $pass = $cfg["pass"];
  $port = $cfg["port"] ?? 3306;
  $charset = $cfg["charset"] ?? "utf8mb4";

  $dsn = "mysql:host={$host};port={$port};dbname={$db};charset={$charset}";
  return new PDO($dsn, $user, $pass, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
  ]);
}

try {
  $raw = file_get_contents("php://input") ?: "";
  $data = json_decode($raw, true);
  if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Formato JSON non valido"]);
    exit;
  }

  $id = (int)($data["id"] ?? 0);
  if ($id <= 0) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "ID cliente mancante o non valido"]);
    exit;
  }

  // obbligatori minimi (coerenti col tuo schema)
  foreach (["nome", "cognome", "data_nascita", "codice_fiscale"] as $req) {
    if (!isset($data[$req]) || trim((string)$data[$req]) === "") {
      http_response_code(400);
      echo json_encode(["status" => "error", "message" => "Campo obbligatorio mancante: $req"]);
      exit;
    }
  }

  $pdo = connectDB();

  // verifica esistenza
  $chk = $pdo->prepare("SELECT 1 FROM `clienti` WHERE `id` = :id");
  $chk->execute(["id" => $id]);
  if (!$chk->fetchColumn()) {
    http_response_code(404);
    echo json_encode(["status" => "error", "message" => "Cliente non trovato"]);
    exit;
  }

  // UNIQUE codice_fiscale: non deve esistere su altri id
  $cf = (string)$data["codice_fiscale"];
  $chkCf = $pdo->prepare("SELECT 1 FROM `clienti` WHERE `codice_fiscale` = :cf AND `id` <> :id LIMIT 1");
  $chkCf->execute(["cf" => $cf, "id" => $id]);
  if ($chkCf->fetchColumn()) {
    http_response_code(409);
    echo json_encode(["status" => "error", "message" => "Codice fiscale già presente"]);
    exit;
  }

  // campi aggiornabili (schema reale)
  $fields = [
    "nome","cognome","ragione_sociale","data_nascita","indirizzo","codice_fiscale",
    "email","telefono","località","Provincia","cap","luogo_di_nascita","sdi_pec",
    "numero_carta_identita","rilasciato_da",
    "n_revoip1000","n_revoipchagg","costo_attivazione","canone_mensile",
    "numero_da_migrare1","codice_di_migrazione1","Operatore_Cedente1","tipologia1",
    "numero_da_migrare2","codice_di_migrazione2","Operatore_Cedente2","tipologia2",
    "numero_da_migrare3","codice_di_migrazione3","Operatore_Cedente3","tipologia3",
    "note","data_pratica","luogo_pratica"
  ];

  $set = [];
  $params = ["id" => $id];

  foreach ($fields as $f) {
    if (array_key_exists($f, $data)) {
      $set[] = "`$f` = :$f";
      $v = $data[$f];
      $params[$f] = ($v === "" ? null : $v);
    }
  }

  if (!$set) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Nessun campo da aggiornare"]);
    exit;
  }

  $sql = "UPDATE `clienti` SET " . implode(", ", $set) . " WHERE `id` = :id";
  $stmt = $pdo->prepare($sql);
  $stmt->execute($params);

  // ritorna cliente aggiornato
  $out = $pdo->prepare("SELECT * FROM `clienti` WHERE `id` = :id LIMIT 1");
  $out->execute(["id" => $id]);
  $client = $out->fetch();

  echo json_encode(["status" => "success", "message" => "Cliente aggiornato con successo", "client" => $client]);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(["status" => "error", "message" => "Errore server", "detail" => $e->getMessage()]);
}
