<?php
require_once('../../server/db_conn.php');

$id = $_POST["id"];

if (empty($id)) 
{
    echo "false"; 
} 
else
{
    $sql = "SELECT * FROM iemh_team1.hardware_infomation WHERE user_id = '$id'";
    $result = $conn->query($sql);
    
    $response = array();
    
    if ($result->num_rows > 0) {
      $row = $result->fetch_assoc();
      $response["exists"] = true;
      $response["temp"] = $row["temperature"];
      $response["hum"] = $row["humidity"];
      $response["ph"] = $row["pH"];
      $response["light"] = $row["light_grade"];
    } else {
      $response["exists"] = false;
    }
    
    // 데이터 반환
    header("Content-Type: application/json");
    echo json_encode($response);
    
    $conn->close();
}

?>