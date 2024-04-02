import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';  
import Settings from '../profile/Settings';
import style from './Header.module.css';
import Profile from '../profile/Profile';

const Header = () => {
    const [token, setToken] = useState('');
    const [image, setImage] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [bio, setBio] = useState('');

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            fetchUserData(storedToken); 
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken('');
        setImage('');
        setUsername('');
        setEmail('');
        setBio('');
    };

    const fetchUserData = async (token) => {
        try {
            const response = await axios.get('https://api.realworld.io/api/user', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const userData = response.data.user;
            setImage(userData.image);
            setUsername(userData.username);
            setEmail(userData.email);
            setBio(userData.bio);

        } catch (error) {
            console.error('Fetching user data failed:', error);
        }
    };

    return (
        <nav className="navbar navbar-light">
            <div className="container">
                <Link
                    className="navbar-brand"
                    to="/"
                    style={{
                        fontFamily: 'titillium web, sans-serif',
                        fontSize: '1.5rem',
                        paddingTop: '0',
                        marginRight: '2rem',
                        color: '#5cb85c',
                        fontWeight: 'bold'
                    }}
                >
                    Conduit
                </Link>
                <div className="ml-auto">
                    <ul className="nav navbar-nav d-flex flex-row">
                        <li className="nav-item" style={{ marginLeft: '15px' }}>
                            <Link className="nav-link" to="/" >Home</Link>
                        </li>
                        {token ? (
                            <>
                                <li className="nav-item" style={{ marginLeft: '15px' }}>
                                    <Link className="nav-link" to="/settings">Settings</Link>
                                </li>
                                <li className="nav-item" style={{ marginLeft: '15px' }}>
                                    <Link className="nav-link" to="/new-article">New Article</Link>
                                </li>
                                <li className="nav-item" style={{ marginLeft: '15px' }}>
                                    <Link to={`/profile/${username}`} className="nav-link active">
                                        <img src={image} className={style.imageUser} alt={username} />
                                        <span className={style.nameUser}>{username}</span>
                                    </Link>
                                </li>
                                <li className="nav-item" style={{ marginLeft: '15px' }}>
                                    <button className="nav-link btn btn-link" onClick={handleLogout}>Logout</button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item" style={{ marginLeft: '15px' }}>
                                    <Link className="nav-link" to="/users/login">Sign In</Link>
                                </li>
                                <li className="nav-item" style={{ marginLeft: '15px' }}>
                                    <Link className="nav-link" to="/users/register">Sign Up</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Header;