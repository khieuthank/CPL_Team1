import React, { useMemo } from 'react';
import style from './Articles.module.css';
import { useState, useEffect } from 'react';
import { formatDate } from '../../utils/utils';

import { useNavigate } from 'react-router-dom';

const ArticlesTag = ({ tag }) => {

    const itemsPerPage = 10;

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isloadArticles, setIsLoadArticles] = useState(true);
    const [articles, setArticles] = useState([]);

    const nav = useNavigate();

    useEffect(() => {
        setIsLoadArticles(true);
            const apiUrl = `https://api.realworld.io/api/articles?limit=${itemsPerPage}&offset=${(currentPage - 1) * itemsPerPage}&tag=${tag}`;
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    setArticles(data.articles);
                    setTotalPages(Math.ceil(data.articlesCount / itemsPerPage));
                    setIsLoadArticles(false);
                })
                .catch(error => console.error('Error fetching tags:', error));
        }, [currentPage,tag]);

        const handlePageChange = (page) => {
            setCurrentPage(page);
        };
    
        const handleToArticleDetails = (slug) => {
            nav(`/article/${slug}`);
        }
        console.log(isloadArticles);
   
    return (
        <div>
             {
                isloadArticles ? (<p>Loading...</p>) : (
                    articles.map(article => (
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
                                    <button><i class="fa-solid fa-heart"></i> {article.favoritesCount}</button>
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

export default ArticlesTag;