<?php
require_once('../../server/db_conn.php');

$id = $_POST["id"];
$led = $_POST["led"];

if (empty($id) || empty($led)) 
{
    echo "false"; 
} 
else
{
    if ($led)

    $sql = "UPDATE iemh_team1.sett SET light = '$led'";
    
    $result = mysqli_query($conn, $sql);
    
    if ($result !== false) {
        echo "access";
    } else {
        echo "release";
    }
}

?>
