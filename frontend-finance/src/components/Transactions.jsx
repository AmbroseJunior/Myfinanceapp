//transaction lists
import React, { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'

const Transactionsbyid_user = () => {
    const [transactions, setTransactions] = useState([])
    //get user from php database
    const [user, setUser] = useState(null);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await fetch(`/api/transaction.php?userId=${user.id_user}`);
                const data = await response.json();
                setTransactions(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
        };

        const fetchUser = async () => {
            try {
                const response = await api.get('/user.php');
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user:', error.response?.data || error.message);
            }
        };

        fetchUser();
        fetchTransactions();
    })

    return (
        <div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>id_transaction</th>
                        <th>id_account</th>
                        <th>category</th>
                        <th>type_transaction</th>
                        <th>amount</th>
                        <th>description</th>
                        <th>transaction_date</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction) => (
                        <tr key={transaction.id_transaction}>
                            <td>{transaction.id_transaction}</td>
                            <td>{transaction.id_account}</td>
                            <td>{transaction.category}</td>
                            <td>{transaction.type_transaction}</td>
                            <td>{transaction.amount}</td>
                            <td>{transaction.description}</td>
                            <td>{transaction.transaction_date}</td>
                            <td>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => navigate(`/edit/${transaction.id_transaction}`)}
                                >
                                    Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    )    
}

export default Transactionsbyid_user