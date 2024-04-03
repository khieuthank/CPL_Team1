import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './profile.css';

const Profile = () => {
    const { username } = useParams();
    const [image, setImage] = useState('');
    const [usernameState, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [bio, setBio] = useState('');
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            fetchUserData(storedToken);
            fetchUserArticles(storedToken);
        }
    }, []);

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

    const fetchUserArticles = async (token) => {
        try {
            const response = await axios.get(`https://api.realworld.io/api/articles?author=${username}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setArticles(response.data.articles);

        } catch (error) {
            console.error('Fetching user articles failed:', error);
        }
    };

    return (
        <div className='profile'>
            <div className='banner-profile'>

                <div className='image-profile'>
                    <img src={image} alt="User"></img>
                </div>
                <div className='username'>
                    {usernameState}
                </div>
                <div>
                    {bio}
                </div>
                <div className='button-banner'>
                    <Link to="/settings">
                        <button>
                            Edit profile setting
                        </button>
                    </Link>
                </div>

            </div>
            <div className='body-profile'>
                <div className='nav'>
                    <div className='nav-item ' >
                        <div>
                        My Articles
                        
                        </div>
                        
                    </div>
                    <div className='nav-item '>
                        <div>
                        Favorited Articles
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
