<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Local Events Manager</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>Local Events Manager</h1>
        <nav>
            <ul>
                <li><a href="index.php">Strona główna</a></li>
                <li><a href="core.php">Wydarzenia</a></li>
                <li><a href="kontakt.php">Kontakt</a></li>
                <li><a href="my_events.php">Moje eventy</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <section>
            <h2>Wszystkie wydarzenia</h2>
            <p>Znajdziesz tutaj wszystkie wydarzenia dodane przez użytkowników.</p>
</section>
</main> 
</body>

<?php
session_start();
$login = $_SESSION['login'];

$conn = new mysqli("localhost", "root", "", "events");
$result = $conn->query("SELECT * FROM eventstabl ORDER BY date DESC, time DESC");

echo '<div class="events-container">'; 

while ($row = $result->fetch_assoc()) {
    echo '<div class="event-box">';
    echo '<img src="' . $row['image'] . '" class="event-image">';
    echo '<h3>' . htmlspecialchars($row['name']) . '</h3>';
    echo "<p>Data: ". htmlspecialchars($row['date']) . ' ' . htmlspecialchars($row['time']) . '</p>';
    echo "<p>Typ: " . htmlspecialchars($row['type']) . '</p>';
    echo "<p>Miasto: " . htmlspecialchars($row['local']) . '</p>';
    echo "<p>Opis wydarzenia: " . htmlspecialchars($row['description']) . '</p>';
    echo '</div>';
}
echo '</div>';

?>
