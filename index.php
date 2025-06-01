










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
                <li><a href="#">Strona główna</a></li>
                <li><a href="#">Wydarzenia</a></li>
                <li><a href="kontakt.php">Kontakt</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <section>
            <h2>Witamy!</h2>
            <p>To jest strona projektu zaliczeniowego „System zarządzania wydarzeniami lokalnymi”.</p>

        <button class="button1" onclick="toggleForm()">Zarejestrować się</button>
        <button onclick="toggleForm2()">Wejść się</button>

        <div id="registrationForm">
            <form action="register.php" method="post" class="form-box">
                <input type="text" placeholder="login" name="login">
                <input type="text" placeholder="password" name="password">
                <input type="text" placeholder="repeat password" name="repeatpass">
                <input type="text" placeholder="email" name="email">
                <button type="submit">Zarejestrować się</button>
            </form>
        </div>

        <div id="wejscForm2">
            <form action="login.php" method="post" class="form-box">
                <input type="text" placeholder="login" name="login">
                <input type="text" placeholder="password" name="password">
                <button type="submit">Wejść</button>
            </form>
        </div>  
        
        </section>
    </main>

    <script>
    function toggleForm() {
      const form = document.getElementById("registrationForm");
      form.style.display = (form.style.display === "none") ? "block" : "none";
    }

    function toggleForm2() {
      const form = document.getElementById("wejscForm2");
      form.style.display = (form.style.display === "none") ? "block" : "none";
    }
  </script>




    <footer>
        <p>&copy; 2025 Local Events Manager</p>
    </footer>
</body>
</html>
