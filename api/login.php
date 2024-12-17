<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include '../includes/connect.php';

$data = json_decode(file_get_contents('php://input'));

if (empty($data->email) || empty($data->password)) {
    echo json_encode(['status' => 0, 'message' => 'Email and password are required']);
    exit;
}

try {
    $email = trim($data->email);
    $password = trim($data->password);

    // Check if the user exists
    $sql = "SELECT * FROM user WHERE email = :email";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['password'])) {
        // Password is correct
        unset($user['password']); // Don't send the hashed password back
        echo json_encode([
            'status' => 1,
            'message' => 'Login successful',
            'user' => $user // Send back user details
        ]);
    } else {
        echo json_encode(['status' => 0, 'message' => 'Invalid email or password']);
    }
} catch (PDOException $e) {
    echo json_encode(['status' => 0, 'message' => 'Database error: ' . $e->getMessage()]);
}

