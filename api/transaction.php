<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include '../includes/connect.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: *");

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET': // Fetch transactions
        $id_user = $_GET['id_user'] ?? null;

        if ($id_user) {
            try {
                $sql = "
                    SELECT t.id_transaction, t.fk_id_account, t.fk_id_category, t.fk_type_transaction, 
                    t.amount, t.description, t.transaction_date, a.Bank
                    FROM transaction t
                    LEFT JOIN account a ON t.fk_id_account = a.id_account
                    WHERE a.fk_id_user = :id_user
                ";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':id_user', $id_user, PDO::PARAM_INT);
                $stmt->execute();
                $transactions = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($transactions);
            } catch (Exception $e) {
                echo json_encode(['status' => 0, 'message' => 'Database error', 'error' => $e->getMessage()]);
            }
        } else {
            echo json_encode(['status' => 0, 'message' => 'Invalid user ID']);
        }
        break;

        case 'POST': // Add a transaction
            $data = json_decode(file_get_contents('php://input'), true);
        
            if (
                isset($data['id_user'], $data['fk_id_category'], $data['fk_type_transaction'], 
                      $data['amount'], $data['description'], $data['transaction_date'])
            ) {
                try {
                    // Start a transaction
                    $conn->beginTransaction();
        
                    // Fetch account ID for the user
                    $sql_account = "SELECT id_account FROM account WHERE fk_id_user = :id_user LIMIT 1";
                    $stmt_account = $conn->prepare($sql_account);
                    $stmt_account->bindParam(':id_user', $data['id_user'], PDO::PARAM_INT);
                    $stmt_account->execute();
                    $account = $stmt_account->fetch(PDO::FETCH_ASSOC);
        
                    if (!$account) {
                        echo json_encode(['status' => 0, 'message' => 'Account not found for the user']);
                        exit;
                    }
        
                    $fk_id_account = $account['id_account'];
        
                    // Insert the transaction
                    $sql = "
                        INSERT INTO transaction (fk_id_account, fk_id_category, fk_type_transaction, 
                        amount, description, transaction_date, created_at, updated_at) 
                        VALUES (:fk_id_account, :fk_id_category, :fk_type_transaction, :amount, 
                                :description, :transaction_date, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                    ";
                    $stmt = $conn->prepare($sql);
                    $stmt->bindParam(':fk_id_account', $fk_id_account, PDO::PARAM_INT);
                    $stmt->bindParam(':fk_id_category', $data['fk_id_category'], PDO::PARAM_INT);
                    $stmt->bindParam(':fk_type_transaction', $data['fk_type_transaction'], PDO::PARAM_INT);
                    $stmt->bindParam(':amount', $data['amount']);
                    $stmt->bindParam(':description', $data['description']);
                    $stmt->bindParam(':transaction_date', $data['transaction_date']);
        
                    if (!$stmt->execute()) {
                        $conn->rollBack();
                        echo json_encode(['status' => 0, 'message' => 'Failed to add transaction']);
                        exit;
                    }
        
                    // Update current_balance
                    $balance_update_sql = "
                        UPDATE user 
                        SET current_balance = current_balance 
                        + CASE WHEN :fk_type_transaction = 1 THEN :amount ELSE -:amount END
                        WHERE id_user = :id_user
                    ";
                    $stmt_balance_update = $conn->prepare($balance_update_sql);
                    $stmt_balance_update->bindParam(':fk_type_transaction', $data['fk_type_transaction'], PDO::PARAM_INT);
                    $stmt_balance_update->bindParam(':amount', $data['amount']);
                    $stmt_balance_update->bindParam(':id_user', $data['id_user'], PDO::PARAM_INT);
        
                    if (!$stmt_balance_update->execute()) {
                        $conn->rollBack();
                        echo json_encode(['status' => 0, 'message' => 'Failed to update balance']);
                        exit;
                    }
        
                    // Commit transaction
                    $conn->commit();
        
                    echo json_encode(['status' => 1, 'message' => 'Transaction added successfully']);
                } catch (Exception $e) {
                    $conn->rollBack();
                    echo json_encode(['status' => 0, 'message' => 'Database error', 'error' => $e->getMessage()]);
                }
            } else {
                echo json_encode(['status' => 0, 'message' => 'Invalid input: Missing required fields']);
            }
            break;
        
        
            case 'PUT': // Update a transaction
                $data = json_decode(file_get_contents('php://input'), true);
            
                if (
                    isset($data['id_transaction'], $data['id_user'], $data['fk_id_category'], 
                          $data['fk_type_transaction'], $data['amount'], $data['description'], $data['transaction_date'])
                ) {
                    try {
                        $conn->beginTransaction();
            
                        // Fetch original transaction details
                        $sql_original = "SELECT fk_id_account, amount, fk_type_transaction FROM transaction WHERE id_transaction = :id_transaction";
                        $stmt_original = $conn->prepare($sql_original);
                        $stmt_original->bindParam(':id_transaction', $data['id_transaction'], PDO::PARAM_INT);
                        $stmt_original->execute();
                        $original_transaction = $stmt_original->fetch(PDO::FETCH_ASSOC);
            
                        if (!$original_transaction) {
                            echo json_encode(['status' => 0, 'message' => 'Transaction not found']);
                            $conn->rollBack();
                            exit;
                        }
            
                        $original_amount = $original_transaction['amount'];
                        $original_type = $original_transaction['fk_type_transaction'];
                        $fk_id_account = $original_transaction['fk_id_account'];
            
                        // Compute balance adjustment
                        $balance_adjustment = 0;
                        if ($original_type != $data['fk_type_transaction']) {
                            $balance_adjustment = ($data['fk_type_transaction'] == 1 ? $data['amount'] : -$data['amount']) -
                                                  ($original_type == 1 ? $original_amount : -$original_amount);
                        } else {
                            $balance_adjustment = $data['amount'] - $original_amount;
                        }
            
                        // Update transaction details
                        $sql_update = "
                            UPDATE transaction 
                            SET fk_id_account = :fk_id_account, fk_id_category = :fk_id_category, 
                                fk_type_transaction = :fk_type_transaction, amount = :amount, 
                                description = :description, transaction_date = :transaction_date, 
                                updated_at = CURRENT_TIMESTAMP 
                            WHERE id_transaction = :id_transaction
                        ";
                        $stmt_update = $conn->prepare($sql_update);
                        $stmt_update->bindParam(':id_transaction', $data['id_transaction'], PDO::PARAM_INT);
                        $stmt_update->bindParam(':fk_id_account', $fk_id_account, PDO::PARAM_INT);
                        $stmt_update->bindParam(':fk_id_category', $data['fk_id_category'], PDO::PARAM_INT);
                        $stmt_update->bindParam(':fk_type_transaction', $data['fk_type_transaction'], PDO::PARAM_INT);
                        $stmt_update->bindParam(':amount', $data['amount']);
                        $stmt_update->bindParam(':description', $data['description']);
                        $stmt_update->bindParam(':transaction_date', $data['transaction_date']);
            
                        if (!$stmt_update->execute()) {
                            $conn->rollBack();
                            echo json_encode(['status' => 0, 'message' => 'Failed to update transaction']);
                            exit;
                        }
            
                        // Update current balance
                        $balance_update_sql = "UPDATE user SET current_balance = current_balance + :balance_adjustment WHERE id_user = :id_user";
                        $stmt_balance_update = $conn->prepare($balance_update_sql);
                        $stmt_balance_update->bindParam(':balance_adjustment', $balance_adjustment);
                        $stmt_balance_update->bindParam(':id_user', $data['id_user'], PDO::PARAM_INT);
            
                        if (!$stmt_balance_update->execute()) {
                            $conn->rollBack();
                            echo json_encode(['status' => 0, 'message' => 'Failed to update balance']);
                            exit;
                        }
            
                        $conn->commit();
                        echo json_encode(['status' => 1, 'message' => 'Transaction updated successfully']);
                    } catch (Exception $e) {
                        $conn->rollBack();
                        echo json_encode(['status' => 0, 'message' => 'Database error', 'error' => $e->getMessage()]);
                    }
                } else {
                    echo json_encode(['status' => 0, 'message' => 'Invalid input: Missing required fields']);
                }
                break;
            
                case 'DELETE':
                    $data = json_decode(file_get_contents('php://input'), true);
                
                    if (isset($data['id_transaction'])) {
                        try {
                            // Start a transaction
                            $conn->beginTransaction();
                
                            // Delete the transaction
                            $sql_delete = "DELETE FROM transaction WHERE id_transaction = :id_transaction";
                            $stmt_delete = $conn->prepare($sql_delete);
                            $stmt_delete->bindParam(':id_transaction', $data['id_transaction'], PDO::PARAM_INT);
                
                            if (!$stmt_delete->execute()) {
                                $conn->rollBack();
                                echo json_encode(['status' => 0, 'message' => 'Failed to delete transaction']);
                                exit;
                            }
                
                            // Commit the transaction
                            $conn->commit();
                
                            echo json_encode(['status' => 1, 'message' => 'Transaction deleted successfully']);
                        } catch (Exception $e) {
                            $conn->rollBack();
                            echo json_encode(['status' => 0, 'message' => 'Database error', 'error' => $e->getMessage()]);
                        }
                    } else {
                        echo json_encode(['status' => 0, 'message' => 'Invalid input: Missing transaction ID']);
                    }
                }
                