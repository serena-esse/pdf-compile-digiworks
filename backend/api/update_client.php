<?php
// ✅ Abilita la visualizzazione degli errori per debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// ✅ **Abilita CORS per React (localhost:3000)**
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

// ✅ GESTIONE DELLE RICHIESTE PRE-FLIGHT (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ✅ **Connessione al database**
$servername = "ictddzr805.mysql.db";
$username = "ictddzr805";
$password = "sj8JqSxCv5sH";
$dbname = "ictddzr805";

$conn = new mysqli($servername, $username, $password, $dbname);

// ✅ **Verifica connessione**
if ($conn->connect_error) {
    error_log("❌ ERRORE CONNESSIONE DB: " . $conn->connect_error);
    die(json_encode(["status" => "error", "message" => "Errore connessione DB: " . $conn->connect_error]));
}

// ✅ **Controlla se la richiesta è POST**
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["status" => "error", "message" => "Metodo non valido, usa POST"]);
    exit();
}

// ✅ **Leggi il JSON in ingresso**
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// ✅ **Debug: Verifica i dati ricevuti**
error_log("📥 JSON ricevuto: " . print_r($data, true));

if (!$data) {
    echo json_encode(["status" => "error", "message" => "Formato JSON non valido"]);
    exit();
}

// ✅ **Controlla se l'ID è presente**
$id = $data['id'] ?? null;
if (!$id) {
    echo json_encode(["status" => "error", "message" => "ID cliente mancante"]);
    exit();
}

// ✅ **Converti i dati e normalizza**
$campi = [
    $data['nome'] ?? "",
    $data['cognome'] ?? "",
    $data['ragione_sociale'] ?? "",
    $data['data_nascita'] ?? "",
    $data['indirizzo'] ?? "",
    $data['codice_fiscale'] ?? "",
    $data['email'] ?? "",
    $data['telefono'] ?? "",
    $data['località'] ?? "",
    $data['Provincia'] ?? "",
    $data['cap'] ?? "",
    $data['luogo_di_nascita'] ?? "",
    $data['sdi_pec'] ?? "",
    $data['numero_carta_identita'] ?? "",
    $data['rilasciato_da'] ?? "",
    (int)($data['n_revoip1000'] ?? 0),
    (int)($data['n_revoipchagg'] ?? 0),
    (float)($data['costo_attivazione'] ?? 0),
    (float)($data['canone_mensile'] ?? 0),
    $data['numero_da_migrare1'] ?? "",
    $data['codice_di_migrazione1'] ?? "",
    $data['Operatore_Cedente1'] ?? "",
    $data['tipologia1'] ?? "",
    $data['numero_da_migrare2'] ?? "",
    $data['codice_di_migrazione2'] ?? "",
    $data['Operatore_Cedente2'] ?? "",
    $data['tipologia2'] ?? "",
    $data['numero_da_migrare3'] ?? "",
    $data['codice_di_migrazione3'] ?? "",
    $data['Operatore_Cedente3'] ?? "",
    $data['tipologia3'] ?? "",
    $data['note'] ?? "",
    $data['data_pratica'] ?? "",
    $data['luogo_pratica'] ?? "",
    (int)$data['id']
];

// ✅ **Query SQL per l'update**
$sql = "
    UPDATE clienti SET 
        nome=?, cognome=?, ragione_sociale=?, data_nascita=?, indirizzo=?, codice_fiscale=?, 
        email=?, telefono=?, località=?, Provincia=?, cap=?, luogo_di_nascita=?, sdi_pec=?, 
        numero_carta_identita=?, rilasciato_da=?, n_revoip1000=?, n_revoipchagg=?, 
        costo_attivazione=?, canone_mensile=?, numero_da_migrare1=?, codice_di_migrazione1=?, Operatore_Cedente1=?, tipologia1=?, 
        numero_da_migrare2=?, codice_di_migrazione2=?, Operatore_Cedente2=?, tipologia2=?, 
        numero_da_migrare3=?, codice_di_migrazione3=?, Operatore_Cedente3=?, tipologia3=?, 
        note=?, data_pratica=?, luogo_pratica=? 
    WHERE id=?";

// ✅ **Debug Query**
error_log("🔵 Query SQL: " . $sql);

// ✅ **Prepara la query SQL**
$stmt = $conn->prepare($sql);
if (!$stmt) {
    error_log("🔴 ERRORE QUERY PREP: " . $conn->error);
    echo json_encode(["status" => "error", "message" => "Errore preparazione query: " . $conn->error]);
    exit();
}

// ✅ **Associa i parametri alla query**
$tipi = "sssssssssssssssiiddsssssssssssssssi"; // 30 stringhe, 2 interi, 2 float, 1 intero (ID)

$stmt->bind_param($tipi, ...$campi);
// ✅ **Debug dati inviati alla query**
error_log("🔵 Dati inviati: " . print_r($campi, true));

// ✅ **Esegui la query**
if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Cliente aggiornato con successo"]);
} else {
    error_log("🔴 ERRORE QUERY: " . $stmt->error);
    echo json_encode(["status" => "error", "message" => "Errore aggiornamento: " . $stmt->error]);
}

// ✅ **Chiudi connessione**
$stmt->close();
$conn->close();
?>