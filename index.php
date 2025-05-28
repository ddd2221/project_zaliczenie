










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
                <li><a href="#">Kontakt</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <section>
            <h2>Witamy!</h2>
            <p>To jest strona projektu zaliczeniowego „System zarządzania wydarzeniami lokalnymi”.</p>
                
            <form action="register.php" method="post">
                <input type="text" placeholder="login" name="login">
                <input type="text" placeholder="password" name="password">
                <input type="text" placeholder="repeat password" name="repeatpass">
                <input type="text" placeholder="email" name="email">
                <button type="submit">Zarejestrowa</button>
            </form>

            <form action="login.php" method="post">
                <input type="text" placeholder="login" name="login">
                <input type="text" placeholder="password" name="password">
                <button type="submit">Wejść</button>
            </form>
            
        </section>
    </main>

    <footer>
        <p>&copy; 2025 Local Events Manager</p>
    </footer>
</body>
</html>
