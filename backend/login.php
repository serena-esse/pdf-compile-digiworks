<?php
session_start();

header("Access-Control-Allow-Origin: https://pdf.digiworks.it");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

function connectDB() {
    $host = 'ictddzr805.mysql.db';
    $db   = 'ictddzr805'; 
    $user = 'ictddzr805';
    $pass = 'sj8JqSxCv5sH';

    $dsn = "mysql:host=$host;dbname=$db";

    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];

    try {
        return new PDO($dsn, $user, $pass, $options);
    } catch (PDOException $e) {
        return null;
    }
}

function login($utente, $password) {
    $pdo = connectDB();
    if (!$pdo) {
        return array('error' => 'Connessione al database fallita');
    }

    $stmt = $pdo->prepare("SELECT id, password FROM users WHERE utente = :utente");
    $stmt->execute(['utente' => $utente]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password'])) {
        $_SESSION['user_id'] = $user['id'];
        return array('success' => true, 'user_id' => $user['id']);
    } else {
        return array('error' => 'Credenziali non valide');
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'));

    if (isset($data->action) && $data->action === 'login' && isset($data->utente) && isset($data->password)) {
        echo json_encode(login($data->utente, $data->password));
    } else {
        echo json_encode(array('error' => 'Parametri mancanti o azione non specificata'));
    }
} else {
    echo json_encode(array('error' => 'Metodo non consentito'));
}
?>
