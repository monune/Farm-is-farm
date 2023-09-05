<?php
$servername = "211.254.214.74";
$username = "team1";
$password = "test";
$dbname = "iemh_team1";

$conn = new mysqli($servername, $username, $password, $dbname);

if($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

?>
