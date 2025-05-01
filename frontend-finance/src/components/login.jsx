import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import 'bootstrap/dist/css/bootstrap.min.css';
import { jwtDecode } from 'jwt-decode';
import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { handleError } from '../services/errorHandler';
import Footer from './Footer';

export default function Login({ onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState('');
    const [isExistingUser, setIsExistingUser] = useState(null);
    const [googleUser, setGoogleUser] = useState(null);
    const navigate = useNavigate();

    const checkUserExists = async (email) => {
        try {
            const response = await api.post('/api/check-user.php', { email });
            setIsExistingUser(response.data.exists);
        } catch (error) {
            setIsExistingUser(false);
        }
    };

    const handleEmailChange = (e) => {
        const emailInput = e.target.value;
        setEmail(emailInput);
        if (emailInput) checkUserExists(emailInput);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!email || !password) {
            setError('Email and password are required.');
            return;
        }

        try {
            const response = await api.post('/api/login.php', { email, password });

            if (response.data.status === 1) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
                navigate('/dashboard');
                onLogin(true);
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            setError(handleError(error));
        }
    };

    const handleGoogleLogin = async (credentialResponse) => {
        try {
            const decoded = jwtDecode(credentialResponse.credential);
            const response = await api.post('/api/google-login.php', {
                email: decoded.email,
                name: decoded.name,
                googleId: decoded.sub
            });
    
            if (response.data.status === 1) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
                
                
                window.location.href = '/dashboard'; 


                console.log('Google Response:', decoded);
                console.log('API Response:', response.data); 
            }
        } catch (error) {
            console.error('Google Auth Error:', error);
            setError("Login failed - check console for details");
        }
    };

    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <Card style={{ width: '50rem', margin: '2rem auto' }}>
                <Card.Img variant="top" src="src/img/bg.jpg" />
                <Card.Body>
                    {/* Email input field */}
                    <Form.Group controlId="formBasicEmail" className="mb-3">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={handleEmailChange}
                        />
                    </Form.Group>

                    {/* Password form shows only if email exists in system */}
                    {isExistingUser && (
                        <Form onSubmit={handleLogin}>
                            <Form.Group controlId="formBasicPassword" className="mb-3">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Button variant="success" type="submit" className="w-100 mb-3">
                                Login with Email
                            </Button>
                        </Form>
                    )}

                    {/* Google login always available */}
                    <div className="text-center mb-3">
                        <GoogleLogin
                            onSuccess={handleGoogleLogin}
                            onError={() => setError("Google login failed")}
                            text={isExistingUser ? "continue_with" : "signup_with"}
                            shape="rectangular"
                            size="large"
                            ux_mode="popup"
                            prompt="select_account"
                        />
                        {/* Optionally show signed-in Google email */}
                        {googleUser?.email && (
                            <div className="mt-2 text-muted" style={{ fontSize: '0.9rem' }}>
                                Signed in as: <strong>{googleUser.email}</strong>
                            </div>
                        )}
                    </div>

                    {/* Error / Success Messages */}
                    {error && <div className="alert alert-danger mt-3">{error}</div>}
                    {message && <div className="alert alert-success mt-3">{message}</div>}

                    {/* Navigation link */}
                    <div className="text-center mt-4">
                        <Button variant="outline-secondary" onClick={() => navigate('/')}>
                            Back to Homepage
                        </Button>
                    </div>
                </Card.Body>
            </Card>
            <Footer />
        </GoogleOAuthProvider>
    );
}
