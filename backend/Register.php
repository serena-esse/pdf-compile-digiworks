<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

function connectDB() {
    $host = 'localhost';
    $db   = 'ictddzr805'; 
    $user = 'root';
    $pass = '';

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

function register($utente, $password) {
    $pdo = connectDB();
    if (!$pdo) {
        return array('error' => 'Connessione al database fallita');
    }

    $stmt = $pdo->prepare("SELECT * FROM users WHERE utente = :utente");
    $stmt->execute(['utente' => $utente]);
    if ($stmt->fetch()) {
        return array('error' => 'Utente già esistente');
    }

    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
    $stmt = $pdo->prepare("INSERT INTO users (utente, password) VALUES (:utente, :password)");
    if ($stmt->execute(['utente' => $utente, 'password' => $hashedPassword])) {
        return array('success' => true);
    } else {
        return array('error' => 'Registrazione fallita');
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'));

     if (isset($data->action) && $data->action === 'register' && isset($data->utente) && isset($data->password)) {
        echo json_encode(register($data->utente, $data->password));
    } else {
        echo json_encode(array('error' => 'Parametri mancanti o azione non specificata'));
    }
} else {
    echo json_encode(array('error' => 'Metodo non consentito'));
}
?>
