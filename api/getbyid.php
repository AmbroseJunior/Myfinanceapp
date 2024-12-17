<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

include '../includes/connect.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

$id_user = $_GET['id_user'] ?? null;

if ($id_user) {
    try {
        $sql = "
            SELECT u.id_user, u.name, u.account_type, u.current_balance, a.Bank
            FROM user u
            LEFT JOIN account a ON u.id_user = a.fk_id_user
            WHERE u.id_user = :id_user
        ";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':id_user', $id_user, PDO::PARAM_INT);
        $stmt->execute();
        $userProfile = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($userProfile) {
            echo json_encode($userProfile);
        } else {
            echo json_encode(['status' => 0, 'message' => 'No profile found for this user']);
        }
    } catch (Exception $e) {
        echo json_encode(['status' => 0, 'message' => 'Database error', 'error' => $e->getMessage()]);
    }
} else {
    echo json_encode(['status' => 0, 'message' => 'Invalid id_user']);
}
