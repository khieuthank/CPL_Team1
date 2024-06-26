import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import axios from 'axios';  
import Settings from '../profile/Settings';
import style from './Header.module.css';
import Profile from '../profile/Profile';
import { useAuth } from '../context/AuthContext';


const Header = () => {
    const [token, setToken] = useState('');
    const [image, setImage] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [bio, setBio] = useState('');
    const { isLoggedIn, handleLogout } = useAuth();

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            fetchUserData(storedToken); 
        }
    }, []);

    // const handleLogout = () => {
    //     localStorage.removeItem('token');
    //     setToken('');
    //     setImage('');
    //     setUsername('');
    //     setEmail('');
    //     setBio('');
    // };

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
                            <NavLink className="nav-link" to="/" >Home</NavLink>
                        </li>
                        {isLoggedIn ? (
                            <>
                                <li className="nav-item" style={{ marginLeft: '15px' }}>
                                    <NavLink className="nav-link" to="/settings">Settings</NavLink>
                                </li>
                                <li className="nav-item" style={{ marginLeft: '15px' }}>
                                    <NavLink className="nav-link" to="/CreateArticles">New Article</NavLink>
                                </li>
                                <li className="nav-item" style={{ marginLeft: '15px' }}>
                                    <NavLink to={`/profile/${username}`} className="nav-link active">
                                        <img src={image} className={style.imageUser} alt={username} />
                                        <span className={style.nameUser}>{username}</span>
                                    </NavLink>
                                </li>
                                <li className="nav-item" style={{ marginLeft: '15px' }}>
                                    <Link to={`/`} style={{textDecoration:'none'}}>
                                    <button className="nav-link btn btn-link" onClick={handleLogout} >Logout</button>        
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item" style={{ marginLeft: '15px' }}>
                                    <NavLink className="nav-link" to="/users/login">Sign In</NavLink>
                                </li>
                                <li className="nav-item" style={{ marginLeft: '15px' }}>
                                    <NavLink className="nav-link" to="/users/register">Sign Up</NavLink>
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