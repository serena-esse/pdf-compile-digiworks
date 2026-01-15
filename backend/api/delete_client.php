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
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
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

  $host = $cfg['host'];
  $db   = $cfg['db'];
  $user = $cfg['user'];
  $pass = $cfg['pass'];
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

try {
  if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Metodo non valido. Usa DELETE."]);
    exit;
  }

  $data = json_decode(file_get_contents('php://input'), true);
  $id = $data['id'] ?? null;

  if (!$id || !ctype_digit((string)$id)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "ID cliente non valido"]);
    exit;
  }

  $pdo = connectDB();

  $stmt = $pdo->prepare("DELETE FROM `clienti` WHERE `id` = :id");
  $stmt->execute(['id' => (int)$id]);

  if ($stmt->rowCount() > 0) {
    echo json_encode(["status" => "success", "message" => "Cliente eliminato con successo"]);
  } else {
    echo json_encode(["status" => "error", "message" => "Cliente non trovato"]);
  }
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(["status" => "error", "message" => "Errore server"]);
}
