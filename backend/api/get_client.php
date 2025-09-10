<?php
// ✅ Abilita la visualizzazione degli errori per il debug
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// ✅ Imposta l'header per JSON e CORS
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

// ✅ Connessione al database
$servername = "ictddzr805.mysql.db";
$username = "ictddzr805";
$password = "sj8JqSxCv5sH";
$dbname = "ictddzr805";

$conn = new mysqli($servername, $username, $password, $dbname);

// ✅ Verifica connessione al database
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Errore connessione DB: " . $conn->connect_error]));
}

// ✅ Controlla se è stato passato un ID nella richiesta GET
if (isset($_GET['id']) && !empty($_GET['id'])) {
    $id = intval($_GET['id']); // Converti l'ID in intero per sicurezza

    // ✅ Query per ottenere un singolo cliente
    $sql = "
    SELECT 
        id, nome, cognome, ragione_sociale, data_nascita, indirizzo, codice_fiscale, 
        email, telefono, località, Provincia, luogo_di_nascita, cap, sdi_pec, 
        numero_carta_identita, numero_da_migrare1, codice_di_migrazione1, 
        Operatore_Cedente1, tipologia1, numero_da_migrare2, codice_di_migrazione2, 
        Operatore_Cedente2, tipologia2, numero_da_migrare3, codice_di_migrazione3, 
        Operatore_Cedente3, tipologia3, note, data_pratica, luogo_pratica,
        rilasciato_da, n_revoip1000, n_revoipchagg, costo_attivazione, canone_mensile
    FROM clienti WHERE id = ?";

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        echo json_encode(["status" => "error", "message" => "Errore preparazione query: " . $conn->error]);
        exit();
    }

    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();

    // ✅ Se il cliente esiste, restituiscilo
    if ($result->num_rows > 0) {
        $cliente = $result->fetch_assoc();
        echo json_encode(["status" => "success", "client" => $cliente]);
    } else {
        echo json_encode(["status" => "error", "message" => "Cliente non trovato"]);
    }

    $stmt->close();
} else {
    // ✅ Se nessun ID è stato passato, restituisci tutti i clienti
    $sql = "SELECT id, nome, cognome, ragione_sociale, data_nascita, indirizzo, codice_fiscale, 
            email, telefono, località, Provincia, luogo_di_nascita, cap, sdi_pec, 
            numero_carta_identita, numero_da_migrare1, codice_di_migrazione1, 
            Operatore_Cedente1, tipologia1, numero_da_migrare2, codice_di_migrazione2, 
            Operatore_Cedente2, tipologia2, numero_da_migrare3, codice_di_migrazione3, 
            Operatore_Cedente3, tipologia3, note, data_pratica, luogo_pratica,
            rilasciato_da, n_revoip1000, n_revoipchagg, costo_attivazione, canone_mensile FROM clienti";

    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $clienti = [];
        while ($row = $result->fetch_assoc()) {
            $clienti[] = $row;
        }
        echo json_encode(["status" => "success", "clienti" => $clienti]);
    } else {
        echo json_encode(["status" => "error", "message" => "Nessun cliente trovato"]);
    }
}

$conn->close();
?>
