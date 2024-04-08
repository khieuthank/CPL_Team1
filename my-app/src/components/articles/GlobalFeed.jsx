import React from 'react';
import style from './Articles.module.css';
import { useState, useEffect } from 'react';
import { formatDate } from '../../utils/utils';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { handleFavoriteRender } from '../../utils/utils';

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
        if (storedToken == null) {
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    setArticles(data.articles);
                    setTotalPages(Math.ceil(data.articlesCount / itemsPerPage));
                    setIsLoadArticles(false);
                })
                .catch(error => console.error('Error fetching tags:', error));
        }
        else {
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

  
    const handleFavorite = (favorite, slug, index) => {
        handleFavoriteRender(favorite, slug, index);
     }

 
 


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
                                    <Link to={`/profileAuthor/${article.author.username}`}>{article.author.username}</Link>
                                        <p>{formatDate(article.createdAt)}</p>
                                    </div>
                                </div>
                                <div className={style.favorite}>
                                    <button id={'fa' + index} className={article.favorited ? style.btnAdd : ''} onClick={() => handleFavorite(article.favoritesCount, article.slug, index)}><i class="fa-solid fa-heart"></i> {article.favoritesCount}</button>
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