import React, { useState } from 'react';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userData = {
            user: {
                username: username,
                email: email,
                password: password
            }
        };

        try {
            const response = await fetch('https://api.realworld.io/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (response.status === 201 && data.user && data.user.token) {
                // Save token to local storage
                localStorage.setItem('token', data.user.token);
                
                // Redirect to home page or user profile page
                window.location.href = '/';
            } else if (response.status === 422) {
                // Handle validation errors
                setError(data.errors.body.join(', '));
            } else {
                setError('Unexpected error occurred');
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError('Unexpected error occurred');
        }
    };

    return (
        <div className="container mt-5">
            <h2>Register</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <p>Already have an account? <a href="/login">Login</a></p>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="username" 
                        name="username" 
                        placeholder="Username" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required 
                    />
                </div>
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
                <button type="submit" className="btn btn-primary">Register</button>
            </form>
        </div>
    );
};

export default Register;
