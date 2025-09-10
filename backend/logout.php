<?php
session_start();
session_destroy();

// Opzionale: Elimina il cookie di sessione per maggiore sicurezza
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// Rispondi con un messaggio di successo
header('Content-Type: application/json');
echo json_encode(["message" => "Logout successful"]);
?>
