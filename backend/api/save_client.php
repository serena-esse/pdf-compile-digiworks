<?php
// ✅ Debugging e CORS
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// ✅ Gestisci richieste OPTIONS (Preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ✅ Connessione al database
$servername = "ictddzr805.mysql.db";
$username = "ictddzr805";
$password = "sj8JqSxCv5sH";
$dbname = "ictddzr805";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    error_log("🔴 Errore connessione DB: " . $conn->connect_error);
    echo json_encode(["status" => "error", "message" => "Errore connessione DB"]);
    exit();
}

// ✅ Controllo richiesta POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["status" => "error", "message" => "Metodo non valido. Usa POST."]);
    exit();
}

// ✅ Leggi JSON in ingresso
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!$data) {
    echo json_encode(["status" => "error", "message" => "Formato JSON non valido.", "data" => $json]);
    exit();
}

// ✅ Controllo campi obbligatori
$campi_obbligatori = ['nome', 'cognome', 'email', 'data_nascita', 'codice_fiscale'];
foreach ($campi_obbligatori as $campo) {
    if (empty($data[$campo])) {
        echo json_encode(["status" => "error", "message" => "Il campo '$campo' è obbligatorio."]);
        exit();
    }
}

// ✅ Normalizza i dati (35 colonne, id escluso)
$campi = [
    "nome", "cognome", "data_nascita", "indirizzo", "codice_fiscale", "email", "telefono",
    "località", "Provincia", "luogo_di_nascita", "cap", "data_pratica", "ragione_sociale",
    "sdi_pec", "numero_carta_identita", "numero_da_migrare1", "codice_di_migrazione1", "Operatore_Cedente1", "tipologia1",
    "numero_da_migrare2", "codice_di_migrazione2", "Operatore_Cedente2", "tipologia2",
    "numero_da_migrare3", "codice_di_migrazione3", "Operatore_Cedente3", "tipologia3",
    "note", "luogo_pratica", "rilasciato_da", "n_revoip1000", "n_revoipchagg", "costo_attivazione", "canone_mensile"
];

// ✅ Prepara i valori da inserire
$valori = [];
foreach ($campi as $campo) {
    $valori[] = isset($data[$campo]) && $data[$campo] !== "" ? $data[$campo] : null;
}

// ✅ Query SQL (34 `?` perché `id` è AUTO_INCREMENT)
$query = "
    INSERT INTO clienti (
        nome, cognome, data_nascita, indirizzo, codice_fiscale, email, telefono,
        località, Provincia, luogo_di_nascita, cap, data_pratica, ragione_sociale, 
        sdi_pec, numero_carta_identita, numero_da_migrare1, codice_di_migrazione1, Operatore_Cedente1, tipologia1,
        numero_da_migrare2, codice_di_migrazione2, Operatore_Cedente2, tipologia2,
        numero_da_migrare3, codice_di_migrazione3, Operatore_Cedente3, tipologia3,
        note, luogo_pratica, rilasciato_da, n_revoip1000, n_revoipchagg, costo_attivazione, canone_mensile
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
";

// ✅ Preparazione query
$stmt = $conn->prepare($query);
if (!$stmt) {
    echo json_encode(["status" => "error", "message" => "Errore preparazione query: " . $conn->error]);
    exit();
}

// ✅ Creare la stringa dei tipi CORRETTA (34 tipi, deve corrispondere ai parametri)
$tipi = "ssssssssssssssssssssssssssssssiidd";
$stmt->bind_param($tipi, ...$valori);




// ✅ Eseguire la query
if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Dati salvati con successo."]);
} else {
    echo json_encode(["status" => "error", "message" => "Errore SQL: " . $stmt->error]);
}

// ✅ Chiudi connessione
$stmt->close();
$conn->close();
?>