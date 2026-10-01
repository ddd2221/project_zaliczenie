<?php
$conn = new mysqli("localhost", "root", "", "events");

$name = $_POST['name'];
$date_from = $_POST['date_from'];
$date_to = $_POST['date_to'];
$type = $_POST['type'];

$query = "SELECT * FROM eventstabl WHERE 1=1";

$params = [];
$types = '';

if (!empty($name)) {
    $query .= " AND name LIKE ?";
    $params[] = "%$name%";
    $types .= 's';
}
if (!empty($date_from)) {
    $query .= " AND date >= ?";
    $params[] = $date_from;
    $types .= 's';
}
if (!empty($date_to)) {
    $query .= " AND date <= ?";
    $params[] = $date_to;
    $types .= 's';
}
if (!empty($type)) {
    $query .= " AND type = ?";
    $params[] = $type;
    $types .= 's';
}

$stmt = $conn->prepare($query);

if (!empty($params)) {
    $stmt->bind_param($types, ...$params);
}

$stmt->execute();
$result = $stmt->get_result();


echo '<div class=".event-box-search-container">';

while ($row = $result->fetch_assoc()) {
    echo '<div class="event-box-search"';
    echo '<img src="/uploads/' . htmlspecialchars($row['image']) . '" class="event-image">';
    echo '<h3>' . htmlspecialchars($row['name']) . '</h3>';
    echo '<p><strong>Data:</strong> ' . htmlspecialchars($row['date']) . ' ' . htmlspecialchars($row['time']) . '</p>';
    echo '<p><strong>Typ:</strong> ' . htmlspecialchars($row['type']) . '</p>';
    echo '<p><strong>Miasto:</strong> ' . htmlspecialchars($row['local']) . '</p>';
    echo '<p><strong>Opis:</strong> ' . htmlspecialchars($row['description']) . '</p>';
    echo '</div>';
}

$stmt->close();
$conn->close();
?>
