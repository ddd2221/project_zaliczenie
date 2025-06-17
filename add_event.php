<?php
session_start();
$login = $_SESSION['login'];

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $imagePath = '';
    if(isset($_FILES['eventImage']) && $_FILES['eventImage']['error'] == 0) {
        $imageName = uniqid() . "_" . basename($_FILES["eventImage"]["name"]);
        $targetDir = "uploads/";
        $targetFilePath = $targetDir . $imageName;
        move_uploaded_file($_FILES["eventImage"]["tmp_name"], $targetFilePath);
        $imagePath = $targetFilePath;
    }

    $name = $_POST['eventName'];
    $date = $_POST['eventDate'];
    $time = $_POST['eventTime'];
    $type = $_POST['eventType'];
    $local = $_POST['eventLocal'];
    $desc = $_POST['description'];

    // Підключення до бази
    $conn = new mysqli("localhost", "root", "", "events");
    $stmt = $conn->prepare("INSERT INTO eventstabl (login, name, date, time, type, local, description, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssssss", $login, $name, $date, $time, $type, $local, $desc, $imagePath);
    $stmt->execute();
    $stmt->close();
    $conn->close();

    echo "success";
    exit;
}




?>
