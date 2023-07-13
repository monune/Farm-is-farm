<?php
// 3 sec delay callback
require_once('../../server/db_conn.php');

$id = $_POST["id"];
if (empty($id)) 
{
    echo "none"; 
} 
else
{
    $sql = "SELECT * FROM iemh_team1.water WHERE user_id = '$id'";
    $result = $conn->query($sql);
    
    $response = array();
    
    if ($result->num_rows > 0) {
      $row = $result->fetch_assoc();
      $response["exists"] = true;
      $response["water"] = $row["water_grade"];
      $response["min_hum"] = $row["min_humidity"];
      $response["max_hum"] = $row["max_humidity"];
    } else {
      $response["exists"] = false;
    }
    
    // 데이터 반환
    header("Content-Type: application/json");
    echo json_encode($response);
    
    $conn->close();
}
?>