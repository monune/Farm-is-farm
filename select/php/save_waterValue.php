<?php
require_once('../../server/db_conn.php');

$id = $_POST["id"];
$min_value = $_POST["min"];
$max_value = $_POST["max"];

if (empty($id) || empty($max_value) || empty($min_value)) {
    echo "none";
} else {
    $sql = "UPDATE iemh_team1.water SET `min_humidity` = '$min_value', `max_humidity` = '$max_value'";
    if ($conn->query($sql) === TRUE) {
        echo "success";
    } else {
        echo "error: ";
    }
}

$conn->close();
?>
