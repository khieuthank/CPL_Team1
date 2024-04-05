import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import style from './YourFeed.module.css';
import { formatDate } from '../../utils/utils';
import { useNavigate } from 'react-router-dom';

const YourFeed = () => {
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const { username } = useParams();
    const [image, setImage] = useState('');
    const [usernameState, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [feedArticles, setfeedArticles] = useState([]);
    const nav = useNavigate();

    const storedToken = localStorage.getItem('token');
    useEffect(() => {
       
        if (storedToken) {
            fetchUserYourFeed(username, storedToken);
        }
    }, [username, currentPage]);



    const fetchUserYourFeed = async (username, token) => {
        try {
            const response = await axios.get(https://api.realworld.io/api/articles/feed?limit=${itemsPerPage}&offset=${(currentPage - 1) * itemsPerPage}, {
                headers: {
                    Authorization: Bearer ${token}
                }
            });

            setfeedArticles(response.data.articles);
            setTotalPages(Math.ceil(response.data.articlesCount / itemsPerPage));
        } catch (error) {
            console.error('Fetching user favorite articles failed:', error);
        }
    };

    const handleToArticleDetails = (slug) => {
        nav(/article/${slug});
    }

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    return (
        <div>
            <div className={style.favoriteContainer}>
                {feedArticles.length > 0 ? (
                    feedArticles.map((article) => (
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
                    ))
                ) : (
                    <p className={style.noArticles}>No articles are here... yet.</p>
                )}
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
    );
};

export default YourFeed;