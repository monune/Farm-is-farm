<?php
require_once('../../server/db_conn.php');

$plantName = $_POST["data"];

$sql = "SELECT * FROM iemh_team1.classification_table WHERE ko_plantName = '$plantName'";
$result = $conn->query($sql);

$response = array();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $response["exists"] = true;
    $response["enName"] = $row["en_plantName"];
    $response["subGenus"] = $row["plantSubGenus"];
    $response["json"] = $row["json_group"];
} else {
    $response["exists"] = false;
}

// 데이터 반환
header("Content-Type: application/json");
echo json_encode($response);

$conn->close();
?>