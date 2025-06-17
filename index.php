










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
                <li><a href="core.php">Wydarzenia</a></li>
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
            <form onsubmit="return validateRegisterForm()" action="register.php" method="post" class="form-box">
                <input type="text" placeholder="login" name="login" id="regLogin">
                <input type="text" placeholder="password" name="password" id="regPassword">
                <input type="text" placeholder="repeat password" name="repeatpass" id="regRepPassword">
                <input type="text" placeholder="email" name="email" id="regEmail">
                <button class="button_core" type="submit">Zarejestrować się</button>
                <div id="regError" style="display: none;" class="error-message"></div>
            </form>
        </div>

        <div id="wejscForm2">
            <form action="login.php" method="post" class="form-box">
                <input type="text" name="login" placeholder="login" id="loglog" required>
                <input type="password" name="password" placeholder="password" id="paspas" required>
                <button type="submit" name="loginbut">Wejść</button>
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



function validateRegisterForm() {
    const login = document.getElementById('regLogin').value.trim();
    const password = document.getElementById('regPassword').value.trim();
    const repeat = document.getElementById('regRepPassword').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const errorDiv = document.getElementById('regError');

    errorDiv.textContent = '';
    errorDiv.style.display = 'none';


    if (!login || !password || !repeat || !email) {
        errorDiv.textContent = 'Wypełnij wszystkie pola'; 
        errorDiv.style.display = 'block';

        setTimeout(() => {
    errorDiv.style.display = 'none';
}, 3000);
return false;
    }

    if (password !== repeat) {
        errorDiv.textContent = 'Hasła się różnią';
        errorDiv.style.display = 'block';
        

        setTimeout(() => {
    errorDiv.style.display = 'none';
}, 3000);
return false;
    }

    if(!email.includes('@')) {
        errorDiv.textContent = 'Email musi zawierać znak @';
        errorDiv.style.display = 'block';
        setTimeout(() => {
            errorDiv.style.display = 'none';
            }, 3000);
        return false;
    }

    if(!/\d/.test(password)) {
        errorDiv.textContent = 'Password musi zawierać liczby';
        errorDiv.style.display = 'block';
        return false;
    } else if (!/[A-Z]/.test(password)) {
        errorDiv.textContent = 'Password musi zawierać wielką literę';
        errorDiv.style.display = 'block';
        return false;
    }

    errorDiv.style.display = 'none';
    return true;
}

    document.getElementById("eventForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const formData = new FormData(this);

    fetch("add_event.php", {
        method: "POST",
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        const success = document.getElementById("eventSuccess");

        if (data.trim() === "success") {
            success.textContent = "✅ Івент успішно створено!";
            success.classList.add("success");
            success.style.display = 'block';

            setTimeout(() => {
                success.style.display = 'none';
                success.textContent = '';
                success.classList.remove("success");
                closeModal();
            }, 3000);
        } else {
            // Вивести повідомлення про помилку (опціонально)
            success.textContent = "❌ Сталася помилка: " + data;
            success.classList.add("error");
            success.style.display = 'block';
        }
    })
    .catch(error => {
        console.error("Помилка при створенні івенту:", error);
    });
});


  </script>




    <footer>
        <p>&copy; 2025 Local Events Manager</p>
    </footer>
</body>
</html>
