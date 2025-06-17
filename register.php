<?php
require_once('db.php');
$login = $_POST['login'];
$password = $_POST['password'];
$repeatpass = $_POST['repeatpass'];
$email = $_POST['email'];
$sql = "INSERT INTO allusers (login, pass, email) VALUES ('$login', '$password', '$email')";


$conn -> query($sql);
?>

<?php include 'event_modal.php'; ?>
<script>
      function openModal() {
  document.getElementById('eventModal2').style.display = 'flex';
}

function closeModal() {
  document.getElementById('eventModal2').style.display = 'none';
}
</script>
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
            </ul>
        </nav>
    </header>
        <div id="errormessage" style="display: none;"></div>

    <main>
        <section>
            <h2>Witamy!</h2>
            <p>Udało się! Jesteś zarejestrowanym.</p>
        </div>  
        
        <button onclick="openModal()" class="buttevent">Stworzyć event</button>
        <button>Szukać event</button>
        </section>
    </main>

    <footer>
        <p>&copy; 2025 Local Events Manager</p>
    </footer>
</body>
</html>
