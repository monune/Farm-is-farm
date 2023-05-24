<?php
require_once('../../server/db_conn.php');

$id = $_POST["id"];

if (empty($id)) 
{
    echo "false"; 
} 
else
{
    $sql = "SELECT temp, hum, ph, light FROM iemh_team1.sett WHERE user_id = '$id'";
    $result = $conn->query($sql);
    
    $response = array();
    
    if ($result->num_rows > 0) {
      $row = $result->fetch_assoc();
      $response["exists"] = true;
      $response["temp"] = $row["temp"];
      $response["hum"] = $row["hum"];
      $response["ph"] = $row["ph"];
      $response["light"] = $row["light"];
    } else {
      $response["exists"] = false;
    }
    
    // 데이터 반환
    header("Content-Type: application/json");
    echo json_encode($response);
    
    $conn->close();
}

?>