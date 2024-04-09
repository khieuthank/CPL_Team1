import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './profile.css';
import { formatDate } from '../../utils/utils';
import { useNavigate } from 'react-router-dom';
import style from './Profile.module.css';

const Profile = () => {
    const itemsPerPage = 5;
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const { username } = useParams();
    const [image, setImage] = useState('');
    const [usernameState, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [bio, setBio] = useState('');
    const [articles, setArticles] = useState([]);
    const [myArticles, setMyArticles] = useState([]);
    const [favoritedArticles, setFavoritedArticles] = useState([]);
    const nav = useNavigate();

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            fetchUserData(storedToken);
        }
        fetchUserYourArticles(username, storedToken);
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
            setEmail(userData.email);
            setBio(userData.bio);
        } catch (error) {
            console.error('Fetching user data failed:', error);
        }
    };
    const fetchUserYourArticles = async (username, token) => {
        try {
            const response = await axios.get(`https://api.realworld.io/api/articles?limit=${itemsPerPage}&offset=${(currentPage - 1) * itemsPerPage}&author=${username}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setMyArticles(response.data.articles);
            setTotalPages(Math.ceil(response.data.articlesCount / itemsPerPage));
        } catch (error) {
            console.error('Fetching my articles failed:', error);
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
        } catch (error) {
            console.error('Fetching favorited articles failed:', error);
        }
    };

    const handleToArticleDetails = (slug) => {
        nav(`/article/${slug}`);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const isArticleFavorited = (article) => {
        return favoritedArticles.some(favArticle => favArticle.slug === article.slug);
    };

    const favoriteArticle = async (slug) => {
        const storedToken = localStorage.getItem('token');
        try {
            await axios.post(`https://api.realworld.io/api/articles/${slug}/favorite`, {}, {
                headers: {
                    Authorization: `Bearer ${storedToken}`
                }
            });
            const updatedArticles = myArticles.map(article => {
                if (article.slug === slug) {
                    return { ...article, favorited: true, favoritesCount: article.favoritesCount + 1 };
                }
                return article;
            });
            setMyArticles(updatedArticles);
            const updatedFavoritedArticles = [...favoritedArticles, updatedArticles.find(article => article.slug === slug)];
            setFavoritedArticles(updatedFavoritedArticles);
        } catch (error) {
            console.error('Favoriting article failed:', error);
        }
    };
    const unfavoriteArticle = async (slug) => {
        const storedToken = localStorage.getItem('token');
        try {
            await axios.delete(`https://api.realworld.io/api/articles/${slug}/favorite`, {
                headers: {
                    Authorization: `Bearer ${storedToken}`
                }
            });
            const updatedArticles = myArticles.map(article => {
                if (article.slug === slug) {
                    return { ...article, favorited: false, favoritesCount: article.favoritesCount - 1 };
                }
                return article;
            });
            setMyArticles(updatedArticles);
            const updatedFavoritedArticles = favoritedArticles.filter(article => article.slug !== slug);
            setFavoritedArticles(updatedFavoritedArticles);
        } catch (error) {
            console.error('Unfavoriting article failed:', error);
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
                        <button className={style.buttonEditProfile}><i class="fa-solid fa-gear"></i> Edit profile settings</button>
                    </Link>
                </div>
            </div>
            <div className='body-profile'>
                <div className={style.navList}>
                    <div className={style.navItemArticles}>
                        <a>
                            My Articles
                        </a>
                    </div>
                    <div className={style.navItemFarvorite}>
                        <Link to="favorites">
                            <a>
                                Favorited Articles
                            </a>
                        </Link>
                    </div>
                </div>
                <div className={style.favoriteContainer}>
                    {myArticles.map((article) => (
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
                                        {isArticleFavorited(article) ? (


                                            <button style={{ backgroundColor: '#5CB85C', color: 'white' }} onClick={() => unfavoriteArticle(article.slug)}>
                                                <i className="fa-solid fa-heart" ></i> {article.favoritesCount}


                                            </button>
                                        ) : (
                                            <button onClick={() => favoriteArticle(article.slug)}>
                                                <i className="fa-solid fa-heart"></i> {article.favoritesCount}
                                            </button>
                                        )}
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

export default Profile;
