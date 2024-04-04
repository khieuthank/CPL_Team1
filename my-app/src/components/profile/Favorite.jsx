import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './profile.css';
import style from './Favorite.module.css';
import { formatDate } from '../../utils/utils';
import { useNavigate } from 'react-router-dom';
const Favorite = () => {
    const itemsPerPage = 5;
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const { username } = useParams();
    const [image, setImage] = useState('');
    const [usernameState, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [favoritedArticles, setFavoritedArticles] = useState([]);
    const nav = useNavigate();

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            fetchUserData(storedToken);
            fetchUserFavoriteArticles(username, storedToken);
        }
    }, [username]);

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
            setBio(userData.bio);

        } catch (error) {
            console.error('Fetching user data failed:', error);
        }
    };

    const fetchUserFavoriteArticles = async (username, token) => {
        try {
            const response = await axios.get(`https://api.realworld.io/api/articles?favorited=${username}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setFavoritedArticles(response.data.articles);
            setTotalPages(Math.ceil(response.data.articles.length / itemsPerPage));
        } catch (error) {
            console.error('Fetching user favorite articles failed:', error);
        }
    };

    const handleToArticleDetails = (slug) => {
        nav(`/article/${slug}`);
    }

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    return (
        <div className='profile'>
            <div className='banner-profile'>
                <div className='image-profile'>
                    <img src={image} alt="User" />
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
            <div className='body-profile' >
                <div className={style.navList}>
                    <div className={style.navItemArticles}>
                        <Link to={`/profile/${username}`}>
                            <a>My Articles</a>
                        </Link>
                    </div>
                    <div className={style.navItemFarvorite}>
                        <a>Favorited Articles</a>
                    </div>
                </div>
                <div className={style.favoriteContainer}>
                    {favoritedArticles
                        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                        .map((article) => (
                            <div className='article-item' key={article.slug}>
                                <div className={style.article}>
                                    <div className={style.articleInfo}>
                                        <div className={style.info}>
                                            <img src={article.author.image} alt="" />
                                            <div className={style.infoDetails}>
                                                <a href="">{article.author.username}</a>
                                                <p>{formatDate(article.createdAt)}</p>
                                            </div>
                                        </div>
                                        <div className={style.favorite}>
                                            <button><i className="fa-solid fa-heart"></i> {article.favoritesCount}</button>
                                        </div>
                                    </div>
                                    <div className={style.articlePreview}>
                                        <div className={style.content} onClick={() => handleToArticleDetails(article.slug)}>
                                            <h5>{article.title}</h5>
                                            <p>{article.description}</p>
                                        </div>
                                        <div className={style.more}>
                                            <div className={style.readmore} onClick={() => handleToArticleDetails(article.slug)}>Read more...</div>
                                            <div className={style.articleTag}>
                                                {
                                                    article.tagList.map((tag, index) => (
                                                        <li key={index}>{tag}</li>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    <div className={style.page}>
                        {
                            Array.from({ length: totalPages }, (_, index) => (
                                <li key={index + 1} onClick={() => handlePageChange(index + 1)} className={currentPage === index + 1 ? style.activePage : null}>
                                    {index + 1}
                                </li>
                            ))
                        }

                    </div>
                </div>
            </div>

        </div>
    );
};

export default Favorite;