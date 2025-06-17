<?php
session_start();
if (!isset($_SESSION['login'])) {
    header("Location: login.php");
    exit;
}
$login = htmlspecialchars($_SESSION['login']);
?>

<html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Kontakty</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>Local Events Manager</h1>
        <nav>
            <ul>
                <li><a href="index.php">Strona główna</a></li>
                <li><a href="core.php">Wydarzenia</a></li>
                <li><a href="my_events.php"><?php echo $login; ?></a></li>
            </ul>
        </nav>
    </header>

     <main>
        <h1>Witamy!</h1>
        <p class="greeting">Cześć, <span class="login"><?php echo $login; ?></span></p>

        <button onclick="openModal()" id="openModalbtn" class="buttevent2">Stworzyć event</button>



        <button onclick="openModalSearch()" id="openModalSearchbtn">Szukać event</button>
        <button onclick="location.href='my_events.php'" class="buttevent4">Moje eventy</button>

        <script>
  const modal = document.getElementById("eventModal");
  const openModalbtn = document.getElementById("openModalBtn");
  const closeBtn = document.querySelector(".closeBtn");

function openModal() {
  document.getElementById('eventModal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('eventModal').style.display = 'none';
}

function openModalSearch() {
      document.getElementById('searchModal').style.display = 'flex';
}


function closeModalSearch() {
      document.getElementById('searchModal').style.display = 'none';
}

  // Закрити при кліку поза вікном
  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };



</script>

        <div id="eventModal" class="modal">
        <div class="modal-content">
        <span class="closeBtn" onclick="closeModal()">&times;</span>
        <h2>Stworzyć event</h2>
        <form id="eventForm" method="POST" action="add_event.php" enctype="multipart/form-data">
            <br> <label for="eventName">Nazwa:</label>
            <input type="text" id="eventName" name="eventName" required></br> 

            <br> <label for="eventDate">Data:</label> 
            <input type="date" id="eventDate" name="eventDate" required></br> 

            <br> <label for="eventTime">Czas:</label>
            <input type="time" id="eventTime" name="eventTime" required></br> 

            <br> <label for="eventLocal">Miejsce:</label>
            <input list="local" name="eventLocal" id="eventLocal">
            <datalist id="local">
                <option value="Warszawa">
                <option value="Wrocław">
                <option value="Kraków">
                <option value="Poznań">
                <option value="Gdańsk"> 
                <option value="Szczecin">
                <option value="Lublin">
                <option value="Bydgoszcz">
                <option value="Katowice">
                <option value="Łódź"> 
                <option value="Rzeszów">
                <option value="Białystok">
                <option value="Toruń">
                <option value="Zielona Góra">
                <option value="Trzebnica"> 
                <option value="Opole">
                <option value="Gorzów Wielkopolski">
                <option value="Częstochowa">
                <option value="Radom">
                <option value="Gliwice"> 
                <option value="Sosnowiec"> 
                <option value="Zabrze">
                <option value="Bielsko-Biała">
                <option value="Tychy">
                <option value="Koszalin">
                <option value="Domanivka"> 
            </datalist></br> 

            <br> <label for="eventType">Typ eventu:</label>
            <input list="Typy" name="eventType" id="eventType">
            <datalist id="Typy">
                <option value="Concert">
                <option value="Konferencja">
                <option value="Warsztaty">
                <option value="Wystawa">
                <option value="Festiwal"> 
                <option value="Targi">
                <option value="Stand-up">
                <option value="Spektakl teatralny">
                <option value="Pokaz filmowy">
                <option value="Wydarzenie sportowe"> 
            </datalist></br> 
            
            <br><label for="eventImage">Zdjęcia:</label>
            <input type="file" id="eventImage" name="eventImage" accept="image/*" required></br>

            <br><label for="description">Opisz:</label> 
            <textarea class="description" id="description" name="description" rows="3"></textarea></br>

            <br><button class="subevent" type="submit">Stworzyć</button></br> 
                </form>
              
            <div id="eventSuccess" class="message success" style="display: none;"></div>


            </div>
        </div>

<div id="searchResults" style="margin: 20px;"></div>



<div id="searchModal" class="modal">
  <div class="modal-content">
    <span class="closeBtn2" onclick="closeModalSearch()">&times;</span>
    <h2>Filtruj wydarzenia</h2>
    <form id="searchForm">
      <br><label>Nazwa:</label>
      <input type="text" name="name"><br>

      <br><label>Data od:</label>
      <input type="date" name="date_from"><br>

      <br><label>Data do:</label>
      <input type="date" name="date_to"><br>

      <br><label>Typ wydarzenia:</label>
      <select name="type">
        <option value="">Wszystkie</option>
        <option value="Concert">Koncert</option>
        <option value="Festival">Festiwal</option>
        <option value="Sport">Sport</option>
        <option value="Teatr">Teatr</option>
      </select></br>

      <br><button type="submit">Szukaj</button></br>
      <div id="results" class="events-container"></div>
    </form>
  </div>
</div>

        <script>
    document.getElementById("eventForm").addEventListener("submit", function(e) {
    e.preventDefault(); 

    const form = this;
    const formData = new FormData(form);

    fetch("add_event.php", {
        method: "POST",
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        const successBox = document.getElementById("eventSuccess");

        if (data.trim() === "success") {
            successBox.textContent = "✅ Wydarzenie zostało utworzone!";
            successBox.style.display = "block";

            setTimeout(() => {
                successBox.style.display = "none";
                closeModal();
                form.reset(); 
            }, 3000);
        } else {
            alert("Bląd: " + data); 
        }
    })
    .catch(err => {
        console.error("Fetch Bląd:", err);
        alert("Nie mogę oddesłać forme");
    });
});

    

document.getElementById("searchForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const formData = new FormData(this);

  fetch('search_events.php', {
    method: 'POST',
    body: formData
  })
  .then(res => res.text())
  .then(data => {

    document.getElementById("searchModal").style.display = "none";
    
    document.getElementById("searchResults").innerHTML = data;
  });
});


</script>
        
        
     </main>

  
    <footer>
        <p>&copy; 2025 Local Events Manager</p>
    </footer>
</html>