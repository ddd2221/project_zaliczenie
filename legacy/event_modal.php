<!-- event_modal.php -->
<div id="eventModal2" class="modal">
    <div class="modal-content2">
        <span class="closeBtn" onclick="closeModal()">&times;</span>
        <h2>Stworzyć event</h2>
        <form id="eventForm" method="POST" action="add_event.php" enctype="multipart/form-data">
            <br><label for="eventName" style=>Nazwa:</label>
            <input type="text" id="eventName" name="eventName" required><br>

            <br><label for="eventDate">Data:</label>
            <input type="date" id="eventDate" name="eventDate" required><br>

            <br><label for="eventTime">Czas:</label>
            <input type="time" id="eventTime" name="eventTime" required><br>

            <br><label for="eventLocal">Miejsce:</label>
            <input type="datetime-local" id="eventLocal" name="eventLocal" required><br>

            <br><label for="eventType">Typ eventu:</label>
            <input list="Typy" name="eventType" id="eventType">
            <datalist id="Typy">
                <option value="Concert">
            </datalist><br>

            <br><label for="eventImage">Zdjęcia:</label>
            <input type="file" id="eventImage" name="eventImage" accept="image/*" required><br>

            <br><label for="description">Opisz:</label>
            <textarea class="description" id="description" name="description" rows="3"></textarea><br>

            <button class="subevent" type="submit">Stworzyć</button>
        </form>
        <div id="eventSuccess" class="message success" style="display: none;"></div>
    </div>
</div>
