import React, { useState } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";

const Transactions = ({ 
    transactions = [], 
    categoryMapping = {}, 
    transactionTypeMapping = {}, 
    onEditTransaction, 
    onDeleteTransaction 
}) => {
    const [editModalShow, setEditModalShow] = useState(false);
    const [editFormData, setEditFormData] = useState({});

    const handleEditChange = (e) => {
        setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = () => {
        // Map category and transaction type names to IDs for backend compatibility
        const categoryReverseMapping = Object.fromEntries(
            Object.entries(categoryMapping).map(([id, name]) => [name, id])
        );
        const transactionTypeReverseMapping = Object.fromEntries(
            Object.entries(transactionTypeMapping).map(([id, name]) => [name, id])
        );

        const updatedTransaction = {
            ...editFormData,
            fk_id_category: categoryReverseMapping[editFormData.category],
            fk_type_transaction: transactionTypeReverseMapping[editFormData.type_transaction],
            amount: parseFloat(editFormData.amount),
            id_transaction: parseInt(editFormData.id_transaction),
            fk_id_account: parseInt(editFormData.fk_id_account),
            description: editFormData.description,
            transaction_date: editFormData.transaction_date,
        };

        onEditTransaction(updatedTransaction);
        setEditModalShow(false);
    };

    return (
        <div>
            <h2>Transactions</h2>
            {transactions.length > 0 ? (
                <Table striped bordered hover responsive size="sm" className="mt-3">
                    <thead>
                        <tr>
                            <th>Transaction id</th>
                            <th>Account id</th>
                            <th>Category</th>
                            <th>Type</th>
                            <th>Amount</th>
                            <th>Description</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((t) => (
                            <tr key={t.id_transaction}>
                                <td>{t.id_transaction}</td>
                                <td>{t.fk_id_account}</td>
                                <td>{categoryMapping[t.fk_id_category] || "Unknown"}</td>
                                <td>{transactionTypeMapping[t.fk_type_transaction] || "Unknown"}</td>
                                <td>${t.amount}</td>
                                <td>{t.description}</td>
                                <td>{t.transaction_date}</td>
                                <td>
                                    <Button
                                        variant="warning"
                                        size="sm"
                                        onClick={() => {
                                            setEditFormData({
                                                id_transaction: t.id_transaction, // Add the transaction ID
                                                fk_id_account: t.fk_id_account, // Account ID
                                                category: categoryMapping[t.fk_id_category], // Map ID to name
                                                type_transaction: transactionTypeMapping[t.fk_type_transaction], // Map ID to name
                                                amount: t.amount,
                                                description: t.description,
                                                transaction_date: t.transaction_date,
                                            });
                                            setEditModalShow(true);
                                        }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => onDeleteTransaction(t.id_transaction)}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : (
                <p>No transactions found.</p>
            )}

            {/* Edit Transaction Modal */}
            <Modal show={editModalShow} onHide={() => setEditModalShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Transaction</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                                as="select"
                                name="category"
                                value={editFormData.category || ""}
                                onChange={handleEditChange}
                            >
                                <option value="">Select Category</option>
                                {Object.values(categoryMapping).map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Type</Form.Label>
                            <Form.Control
                                as="select"
                                name="type_transaction"
                                value={editFormData.type_transaction || ""}
                                onChange={handleEditChange}
                            >
                                <option value="">Select Type</option>
                                {Object.values(transactionTypeMapping).map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Amount</Form.Label>
                            <Form.Control
                                type="number"
                                name="amount"
                                value={editFormData.amount || ""}
                                onChange={handleEditChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                name="description"
                                value={editFormData.description || ""}
                                onChange={handleEditChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="transaction_date"
                                value={editFormData.transaction_date || ""}
                                onChange={handleEditChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setEditModalShow(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleEditSubmit}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Transactions;
