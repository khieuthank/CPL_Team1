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
        }
        fetchUserFavoriteArticles(username, storedToken);
    }, [username, currentPage]);

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

    const favoriteArticle = async (slug) => {
        const storedToken = localStorage.getItem('token');
        try {
            const response = await axios.post(`https://api.realworld.io/api/articles/${slug}/favorite`, {}, {
                headers: {
                    Authorization: `Bearer ${storedToken}`
                }
            });
            fetchUserFavoriteArticles(username, storedToken);
        } catch (error) {
            console.error('Favoriting article failed:', error);
        }
    };

    const unfavoriteArticle = async (slug) => {
        const storedToken = localStorage.getItem('token');
        try {
            const response = await axios.delete(`https://api.realworld.io/api/articles/${slug}/favorite`, {
                headers: {
                    Authorization: `Bearer ${storedToken}`
                }
            });
            fetchUserFavoriteArticles(username, storedToken);
        } catch (error) {
            console.error('Unfavoriting article failed:', error);
        }
    };

    const fetchUserFavoriteArticles = async (username, token) => {
        try {
            const response = await axios.get(`https://api.realworld.io/api/articles?limit=${itemsPerPage}&offset=${(currentPage - 1) * itemsPerPage}&favorited=${username}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setFavoritedArticles(response.data.articles);
            setTotalPages(Math.ceil(response.data.articlesCount / itemsPerPage));
        } catch (error) {
            console.error('Fetching user favorite articles failed:', error);
        }
    };

    const handleToArticleDetails = (slug) => {
        nav(`/article/${slug}`);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };


    const isArticleFavorited = (article) => {
        return article.favorited;
    };

    const FavoriteButton = ({ article }) => {
        if (isArticleFavorited(article)) {
            return (
                <div className={style.favorite}>
                    <button onClick={() => unfavoriteArticle(article.slug)} style={{ backgroundColor: '#5CB85C', color: 'white' }}>
                        <i className="fa-solid fa-heart"></i> {article.favoritesCount}
                    </button>
                </div>
            );
        } else {
            return (
                <div className={style.favorite}>
                    <button onClick={() => favoriteArticle(article.slug)} style={{ backgroundColor: 'white' }}>
                        <i className="fa-solid fa-heart"></i> {article.favoritesCount}
                    </button>
                </div>
            );
        }
    };

    useEffect(() => {
        const link = document.createElement('link');
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
        link.rel = 'stylesheet';
        link.type = 'text/css';
        document.head.appendChild(link);

        return () => {
            document.head.removeChild(link);
        };
    }, []);
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
                    <button className={style.buttonEditFavorite}><i class="fa-solid fa-gear"></i> Edit profile settings</button>
                    </Link>
                </div>
            </div>
            <div className='body-profile'>
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
                    {favoritedArticles.map((article) => (
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
                                    <FavoriteButton article={article} />
                                </div>
                                <div className={style.articlePreview}>
                                    <div className={style.content} onClick={() => handleToArticleDetails(article.slug)}>
                                        <h5>{article.title}</h5>
                                        <p>{article.description}</p>
                                    </div>
                                    <div className={style.more}>
                                        <div className={style.readmore} onClick={() => handleToArticleDetails(article.slug)}>Read more...</div>
                                        <div className={style.articleTag}>
                                            {article.tagList.map((tag, index) => (
                                                <li key={index}>{tag}</li>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className={style.page}>

                        {Array.from({ length: totalPages }, (_, index) => (
                            <li key={index + 1} onClick={() => handlePageChange(index + 1)} className={currentPage === index + 1 ? style.activePage : null}>
                                {index + 1}
                            </li>
                        ))}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Favorite;
