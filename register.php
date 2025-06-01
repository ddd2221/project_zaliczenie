<?php
require_once('db.php');
$login = $_POST['login'];
$password = $_POST['password'];
$repeatpass = $_POST['repeatpass'];
$email = $_POST['email'];

$sql = "INSERT INTO allusers (login, pass, email) VALUES ('$login', '$password', '$email')";

$conn -> query($sql);