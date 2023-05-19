<?php 
require_once('../server/db_conn.php');

$id = $_POST["id"];
$pw = $_POST["pw"];
if (empty($id) || empty($pw)) 
{
    echo "none"; 
} 
else
{
    $sql = "SELECT * FROM login WHERE user_id = '$id' AND user_password = '$pw'";

    $result = mysqli_query($conn, $sql);
    
    if (mysqli_num_rows($result) > 0) {
        echo "access";
    } else {
        echo "release";
    }
}

?>