<?php
$servername = "sever";
$username = "username";
$password = "password";
$dbname = "database_name";

$conn = new mysqli($servername, $username, $password, $dbname);

if($conn->connect_error) {
    // Cnnection error
    die("Connection failed: " . $conn->connect_error);
}
?>
