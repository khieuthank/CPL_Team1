import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './loginRegister.css';

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
                
                // Redirect to home page
                window.location.href = '/';
            } else if (response.status === 422) {
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
        <div className="auth-page">
            <div className="container page">
                <div className="row">
                    <div className="col-md-6 offset-md-3 col-xs-12">
                        <h1 className="text-xs-center">Register</h1>
                        {error && <div className="alert alert-danger text-xs-center">{error}</div>}
                        <Link to="/users/login">
                            <p className="text-xs-center">Already have an account?</p>
                        </Link>
                        
                        <form onSubmit={handleSubmit}>
                            <fieldset className="form-group">
                                <input 
                                    type="text" 
                                    className="form-control form-control-lg" 
                                    id="username" 
                                    name="username" 
                                    placeholder="Username" 
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required 
                                />
                            </fieldset>
                            <fieldset className="form-group">
                                <input 
                                    type="email" 
                                    className="form-control form-control-lg" 
                                    id="email" 
                                    name="email" 
                                    placeholder="Email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required 
                                />
                            </fieldset>
                            <fieldset className="form-group">
                                <input 
                                    type="password" 
                                    className="form-control form-control-lg" 
                                    id="password" 
                                    name="password" 
                                    placeholder="Password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required 
                                />
                            </fieldset>
                            <button type="submit" className="btn btn-lg btn-primary pull-xs-right">Register</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
