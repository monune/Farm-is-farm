<?php
require_once('../../server/db_conn.php');
// id check
if (isset($_POST['user_id'])) {
    $user_id = $_POST['user_id'];

    // SQL Injection Protection
    $stmt = $conn->prepare("SELECT * FROM login WHERE user_id = ?");
    $stmt->bind_param("s", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows == 0) {
        echo "not_exist";
    } else {
        echo "exist";
    }
}

$stmt->close();
$conn->close();
?>