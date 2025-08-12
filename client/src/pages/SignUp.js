import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password, username }),
            });
            const data = await response.json();
            if (data.error) throw new Error(data.error);
            setError("Registration successful! Confirm your email and sign in.");
            navigate('/');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="section">
            <form>
                <div className="edit-form">
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button onClick={handleSignUp}>Sign Up</button>
                </div>
            </form>
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default SignUp;