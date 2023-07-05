<?php
require_once('../../server/db_conn.php');

$selct_infomation = $_POST["select_plant"];

if (empty($selct_infomation)) 
{
    echo "false"; 
} 
else
{
    $sql = "SELECT * FROM iemh_team1.plant_infomation WHERE plant = '$selct_infomation'";
    $result = $conn->query($sql);
    
    $response = array();
    
    if ($result->num_rows > 0) {
      $row = $result->fetch_assoc();
      $response["exists"] = true;
      $response["min_temp"] = $row["min_temperature"];
      $response["max_temp"] = $row["max_temperature"];
      $response["min_hum"] = $row["min_humidity"];
      $response["max_hum"] = $row["max_humidity"];
      $response["min_pH"] = $row["min_pH"];
      $response["max_pH"] = $row["max_pH"];
      $response["light"] = $row["light_requirement"];
    } else {
      $response["exists"] = false;
    }
    
    // 데이터 반환
    header("Content-Type: application/json");
    echo json_encode($response);
    
    $conn->close();
}

?>