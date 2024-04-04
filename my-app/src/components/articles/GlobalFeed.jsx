import React from 'react';
import style from './Articles.module.css';
import { useState, useEffect } from 'react';
import { formatDate } from '../../utils/utils';
import { useAuth } from '../context/AuthContext';

import { redirect, useNavigate } from 'react-router-dom';

const GlobalFeed = () => {

    const itemsPerPage = 10;

    const { isLoggedIn } = useAuth();

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isloadArticles, setIsLoadArticles] = useState(true);
    const [articles, setArticles] = useState([]);

    const storedToken = localStorage.getItem('token');

    const nav = useNavigate();

    useEffect(() => {
        const apiUrl = `https://api.realworld.io/api/articles?limit=${itemsPerPage}&offset=${(currentPage - 1) * itemsPerPage}`;
        if(storedToken == null){
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    setArticles(data.articles);
                    setTotalPages(Math.ceil(data.articlesCount / itemsPerPage));
                    setIsLoadArticles(false);
                })
                .catch(error => console.error('Error fetching tags:', error));
        }
        else{
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
        
    }, [currentPage, isLoggedIn]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleToArticleDetails = (slug) => {
        nav(`/article/${slug}`);
    }

    const handleFavorite = (favorite, slug) => {
        const storedToken = localStorage.getItem('token');
        if (storedToken == null) {
            nav("/users/login");
        } else {
            const apiUrl = `https://api.realworld.io/api/articles/${slug}/favorite`;
            const newData = {
                article: {
                    favoritesCount: favorite + 1
                }
            }
            fetch(apiUrl, {
                method: 'POST',
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
                    console.log('Cập nhật thành công:', data);
                })
                .catch(error => {
                    console.error('Có lỗi xảy ra khi cập nhật:', error);
                });
        }


    }
    return (
        <div>
            {
                isloadArticles ? (<p>Loading...</p>) : (
                    articles.map(article => (
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
                                    <button onClick={() => handleFavorite(article.favoritesCount, article.slug)}><i class="fa-solid fa-heart"></i> {article.favoritesCount}</button>
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

export default GlobalFeed;