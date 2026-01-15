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

/** Debug solo in locale */
$isLocal = ($origin === 'http://localhost:3000' || $origin === 'http://127.0.0.1:3000');

function loadDbConfig(): array {
  $local = __DIR__ . '/../config.local.php';
  $prod  = __DIR__ . '/../config.prod.php';
  if (file_exists($local)) return require $local;
  return require $prod;
}

function connectDB(): PDO {
  $cfg = loadDbConfig();

  $host = $cfg['host'] ?? '127.0.0.1';
  $db   = $cfg['db'] ?? '';
  $user = $cfg['user'] ?? '';
  $pass = $cfg['pass'] ?? '';
  $port = $cfg['port'] ?? 3306;
  $charset = $cfg['charset'] ?? 'utf8mb4';

  $dsn = "mysql:host={$host};port={$port};dbname={$db};charset={$charset}";
  $options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
  ];

  return new PDO($dsn, $user, $pass, $options);
}

/** Genera un "codice fiscale" placeholder univoco (16 char) */
function generateUniqueCF(PDO $pdo): string {
  // DUP + 13 char random = 16
  for ($i = 0; $i < 10; $i++) {
    $rand = strtoupper(bin2hex(random_bytes(8))); // 16 hex
    $cf = substr('DUP' . $rand, 0, 16);

    $chk = $pdo->prepare("SELECT 1 FROM `clienti` WHERE `codice_fiscale` = :cf LIMIT 1");
    $chk->execute(['cf' => $cf]);
    if (!$chk->fetchColumn()) return $cf;
  }
  // fallback estremo
  return substr('DUP' . strtoupper(md5((string)microtime(true))), 0, 16);
}

try {
  if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Metodo non consentito']);
    exit;
  }

  $raw = file_get_contents('php://input');
  $data = json_decode($raw, true);

  $clientId = $data['id'] ?? null;
  if (!$clientId) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'ID mancante']);
    exit;
  }

  $pdo = connectDB();

  // Leggi cliente originale
  $stmt = $pdo->prepare("SELECT * FROM `clienti` WHERE `id` = :id");
  $stmt->execute(['id' => $clientId]);
  $orig = $stmt->fetch();

  if (!$orig) {
    http_response_code(404);
    echo json_encode(['status' => 'error', 'message' => 'Cliente non trovato']);
    exit;
  }

  // CF nuovo (unico) perché quello originale è UNIQUE
  $newCF = generateUniqueCF($pdo);

  /**
   * Duplica TUTTO quello che ha senso,
   * ma:
   * - `codice_fiscale` deve essere nuovo (NOT NULL + UNIQUE)
   * - puoi scegliere se azzerare anche email/telefono (qui li copio, ma puoi metterli NULL)
   * - aggiungo "(copia)" a cognome e ragione_sociale per distinguere
   */
  $sql = "
    INSERT INTO `clienti` (
      `nome`, `cognome`, `data_nascita`, `indirizzo`, `codice_fiscale`,
      `email`, `telefono`, `località`, `Provincia`, `luogo_di_nascita`, `cap`,
      `data_pratica`, `ragione_sociale`, `sdi_pec`, `numero_carta_identita`,
      `numero_da_migrare1`, `codice_di_migrazione1`, `Operatore_Cedente1`, `tipologia1`,
      `numero_da_migrare2`, `codice_di_migrazione2`, `Operatore_Cedente2`, `tipologia2`,
      `numero_da_migrare3`, `codice_di_migrazione3`, `Operatore_Cedente3`, `tipologia3`,
      `note`, `luogo_pratica`, `rilasciato_da`,
      `n_revoip1000`, `n_revoipchagg`, `costo_attivazione`, `canone_mensile`
    )
    SELECT
      `nome`,
      CONCAT(`cognome`, ' (copia)'),
      `data_nascita`,
      `indirizzo`,
      :new_cf,

      `email`,
      `telefono`,
      `località`,
      `Provincia`,
      `luogo_di_nascita`,
      `cap`,

      `data_pratica`,
      CASE
        WHEN `ragione_sociale` IS NULL OR TRIM(`ragione_sociale`) = '' THEN NULL
        ELSE CONCAT(`ragione_sociale`, ' (copia)')
      END,
      `sdi_pec`,
      `numero_carta_identita`,

      `numero_da_migrare1`, `codice_di_migrazione1`, `Operatore_Cedente1`, `tipologia1`,
      `numero_da_migrare2`, `codice_di_migrazione2`, `Operatore_Cedente2`, `tipologia2`,
      `numero_da_migrare3`, `codice_di_migrazione3`, `Operatore_Cedente3`, `tipologia3`,
      `note`, `luogo_pratica`, `rilasciato_da`,
      `n_revoip1000`, `n_revoipchagg`, `costo_attivazione`, `canone_mensile`
    FROM `clienti`
    WHERE `id` = :id
  ";

  $ins = $pdo->prepare($sql);
  $ins->execute([
    'id' => $clientId,
    'new_cf' => $newCF,
  ]);

  $newId = $pdo->lastInsertId();

  $stmt2 = $pdo->prepare("SELECT * FROM `clienti` WHERE `id` = :id");
  $stmt2->execute(['id' => $newId]);
  $newClient = $stmt2->fetch();

  echo json_encode(['status' => 'success', 'client' => $newClient]);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode([
    'status' => 'error',
    'message' => 'Errore duplicazione',
    'debug' => $isLocal ? $e->getMessage() : null
  ]);
}
