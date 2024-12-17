import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Footer from './Footer';

export default function Login({ onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [message, setMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        try {
            const response = await api.post('/api/login.php', {
                email,
                password,
            });
            console.log('API Response:', response.data); 

            if (response.data.status === 1) {
                // Store user details in localStorage
                localStorage.setItem('user', JSON.stringify(response.data.user));

                // Navigate to the dashboard
                setMessage('Login successful!');
                navigate('/Dashboard');
                onLogin(true);console.log('Navigating to Dashboard...');

            } else {
                setError(response.data.message || 'Invalid email or password');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('An error occurred. Please try again.');
        }
    };

    const handleHomepage = () => {
        navigate('/');
    };

    return (
        <>
        <Card style={{ width: '50rem' }}>
            <Card.Img variant="top" src="src/img/bg.jpg" />
            <Card.Body>
                <Form onSubmit={handleLogin}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>

                    {error && <p className="text-danger">{error}</p>}

                    <Form.Group controlId="formBasicCheckbox">
                        <Form.Check type="checkbox" label="Remember me" />
                    </Form.Group>

                    <Card.Body>
                        <Button variant="success" type="submit" onClick={handleLogin}>
                            Login
                        </Button>
                        {message && <p className="text-success mt-3">{message}</p>}
                    </Card.Body>

                    <Card text="dark" className="text-center">
                        <Card.Body>
                            <Card.Text>
                                Don't have an account? <Link to="/register">Register</Link>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                    <Card.Body>
                        <Button variant="success" onClick={handleHomepage}>
                            Homepage
                        </Button>
                    </Card.Body>
                </Form>
            </Card.Body>
        </Card>
        <Footer />
        </>
    ); 
}
