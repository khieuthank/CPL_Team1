import React from 'react';

import { Link } from 'react-router-dom';


const Header = () => {
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
                        color: '#5cb85c'
                    }}
                >
                    Conduit
                </Link>



                <div className="ml-auto">
                    <ul className="nav navbar-nav d-flex flex-row" >
                        <li className="nav-item" style={{
                            marginLeft: '15px'
                        }}>
                            <Link className="nav-link" to="/" >Home</Link>
                        </li>
                        <li className="nav-item" style={{
                            marginLeft: '15px'
                        }}>

                            <Link className="nav-link" to="/users/login">Sign In</Link>

                        </li>
                        <li className="nav-item" style={{
                            marginLeft: '15px'
                        }}>

                            <Link className="nav-link" to="/users/register">Sign Up</Link>

                        </li>
                    </ul>
                </div>
            </div>
        </nav>

    );
};


export default Header;
