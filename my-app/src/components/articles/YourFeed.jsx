import React from 'react';
import style from './Articles.module.css';
import { useState, useEffect } from 'react';
import { formatDate } from '../../utils/utils';
import { useAuth } from '../context/AuthContext';

import { useNavigate } from 'react-router-dom';

const YourFeed = () => {

    const itemsPerPage = 10;

    const { isLoggedIn } = useAuth();

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isloadArticles, setIsLoadArticles] = useState(true);
    const [articles, setArticles] = useState([]);

    const nav = useNavigate();

    const storedToken = localStorage.getItem('token');

    useEffect(() => {
        const apiUrl = `https://api.realworld.io/api/articles/feed?limit=${itemsPerPage}&offset=${(currentPage - 1) * itemsPerPage}`;
        
        if (storedToken) {
            fetch(apiUrl, {
                headers: {
                    'Authorization': `Token ${storedToken}`
                }
            })
                .then(response => response.json())
                .then(data => {
                    setArticles(data.articles);
                    setTotalPages(Math.ceil(data.articlesCount / itemsPerPage));
                    setIsLoadArticles(false);
                })
                .catch(error => console.error('Error fetching tags:', error));
        }
    },  [currentPage, isLoggedIn])

    const handleToArticleDetails = (slug) => {
        nav(`/article/${slug}`);
    }

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleFavorite = (favorite, slug, isFavorite) => {
        const apiUrl = `https://api.realworld.io/api/articles/${slug}/favorite`;
        if (storedToken == null) {
            nav("/users/login");
        } else {
            const newData = {
                article: {
                    favoritesCount: isFavorite ? favorite - 1 : favorite + 1
                }
            };
            fetch(apiUrl, {
                method: isFavorite ? 'DELETE' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${storedToken}`
                },
                body: JSON.stringify(newData)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    setArticles(articles => {
                        return articles.map(article => {
                            if (article.slug === slug) {
                                return {
                                    ...article,
                                    favorited: !isFavorite,
                                    favoritesCount: isFavorite ? article.favoritesCount - 1 : article.favoritesCount + 1
                                };
                            }
                            return article;
                        });
                    });
                })
                .catch(error => {
                    console.error('Error occurred while updating favorite:', error);
                });
        }
    };

    return (
        <div>
            {
                isloadArticles ? (<p>Loading...</p>) : (
                    articles.map((article, index) => (
                        <div className={style.article} key={article.slug}>
                            <div className={style.articleInfo}>
                                <div className={style.info}>
                                    <img src={article.author.image} alt="" />
                                    <div className={style.infoDetails}>
                                        <a href="">{article.author.username}</a>
                                        <p>{formatDate(article.createdAt)}</p>
                                    </div>
                                </div>
                                <div className={style.favorite}>
                                    <button id={'fe' + index} className={article.favorited ? style.btnAdd : ''} onClick={() => handleFavorite(article.favoritesCount, article.slug, article.favorited)}><i class="fa-solid fa-heart"></i> {article.favoritesCount}</button>
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
                    ))
                )
            }

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
    );
};

export default YourFeed;