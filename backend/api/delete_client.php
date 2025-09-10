<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE");
header("Access-Control-Allow-Headers: Content-Type");

// Gestione della richiesta preflight (CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Connessione al database
$servername = "ictddzr805.mysql.db";
$username = "ictddzr805";
$password = "sj8JqSxCv5sH";
$dbname = "ictddzr805";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Errore connessione DB: " . $conn->connect_error]));
}

// Controlla se il metodo della richiesta è DELETE
if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    echo json_encode(["status" => "error", "message" => "Metodo di richiesta non valido. Usa DELETE."]);
    exit();
}

// Ottieni i dati JSON
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id'])) {
    echo json_encode(["status" => "error", "message" => "ID cliente non fornito"]);
    exit();
}

$id = intval($data['id']);

// Esegui la query di eliminazione
$stmt = $conn->prepare("DELETE FROM clienti WHERE id = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Cliente eliminato con successo"]);
} else {
    echo json_encode(["status" => "error", "message" => "Errore eliminazione: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
