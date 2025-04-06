import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState("");
    const navigate = useNavigate();


    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (data.error) throw new Error(data.error);
            localStorage.setItem("access_token", data.token);
            localStorage.setItem("user_id", data.userId);
            console.log("Login successful");
            console.log("User ID:", data.userId);
            console.log("Token:", data.token);
            setError("");
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
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button onClick={handleSignIn} >Sign In</button>
                {error && <p className="error">{error}</p>}
            </div>
            </form>
            </div>
    );
};

export default SignIn;