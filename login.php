<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
session_start();
 // echo "<pre>";
// var_dump($_POST);
// echo "</pre>";
require_once "db.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Перевірка наявності полів
    if (!isset($_POST['login']) || !isset($_POST['password'])) {
        echo "Brakuje danych w formularzu!";
        exit;
    }

    $login = trim($_POST['login']);
    $password = $_POST['password'];

    // Підготовка запиту до бази
    $stmt = $conn->prepare("SELECT login, pass FROM allusers WHERE login = ?");
    if (!$stmt) {
        echo "Błąd przygotowania zapytania: " . $conn->error;
        exit;
    }

    $stmt->bind_param("s", $login);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();

        // Порівняння пароля (текстовий, без hash)
        if ($password === $user['pass']) {
            $_SESSION['login'] = $user['login'];

            // Перенаправлення після входу
            header("Location: dashboard.php");
            exit;
        } else {
            echo "Nieprawidłowe hasło.";
        }
    } else {
        echo "Użytkownik o podanej nazwie nie istnieje.";
    }
} else {
    echo "Nieprawidłowe żądanie. Użyj formularza.";
}
?>