import React, { useState } from 'react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userData = {
            user: {
                email: email,
                password: password
            }
        };

        try {
            const response = await fetch('https://api.realworld.io/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (response.status === 200 && data.user && data.user.token) {
                // Save token to local storage
                localStorage.setItem('token', data.user.token);
                
                // Redirect to home page
                window.location.href = '/';
            } else if (response.status === 401) {
                setError('Invalid email or password');
            } else {
                setError('Unexpected error occurred');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Unexpected error occurred');
        }
    };

    return (
        <div className="container mt-5">
            <h2>Login</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <p>Need an account? <a href="/signup">Sign Up</a></p>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input 
                        type="email" 
                        className="form-control" 
                        id="email" 
                        name="email" 
                        placeholder="Email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input 
                        type="password" 
                        className="form-control" 
                        id="password" 
                        name="password" 
                        placeholder="Password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                    />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
            <button className="btn btn-secondary mt-3" onClick={() => window.location.href = '/'}><i className="fas fa-house"></i> Back to Home</button>
        </div>
    );
};

export default Login;
