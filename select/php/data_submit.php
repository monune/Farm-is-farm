<?php
require_once('../../server/db_conn.php');

$id = $_POST["id"];
$light = $_POST["led"];

if (empty($id)) 
{
    echo "false"; 
} 
else
{
    $sql = "UPDATE iemh_team1.sett SET light = '$light'";
    
    $result = mysqli_query($conn, $sql);
    
    if ($result !== false) {
        echo "access";
    } else {
        echo "release";
    }
}

?>
