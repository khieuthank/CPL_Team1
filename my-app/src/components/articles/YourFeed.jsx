import React from 'react';
import style from './Articles.module.css';
import { useState, useEffect } from 'react';
import { formatDate } from '../../utils/utils';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useFavorite } from '../context/FavoriteContext';

const YourFeed = () => {

    const itemsPerPage = 10;

    const { isLoggedIn } = useAuth();
    const { favorite, handleFavorite } = useFavorite();

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


    useEffect(() =>{
        setArticles(
            articles => {
                return articles.map(article => {
                    if (article.slug === favorite.slug) {
                        return {
                            ...article,
                            favorited: favorite.favorited,
                            favoritesCount: favorite.favoritesCount
                        };
                    }
                    return article;
                });
            }
        )
    },[favorite])

    const handleToArticleDetails = (slug) => {
        nav(`/article/${slug}`);
    }

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };


    const handleFavoriteArticle = (favoritesCount, slug, isLike) => {
        if(storedToken == null){
            nav("/users/login");
        }else{
            handleFavorite(favoritesCount, slug, isLike, storedToken, articles);
        }
        
    }

    if(articles.length == 0){
        return(
            <p className={style.noArticle}>No articles are here... yet.</p>
        )
    }


    return (
        <div className={style.containerYourFeed}>
            {
                isloadArticles ? (<p>Loading...</p>) : (
                    articles.map(article => (
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
                                    <button className={article.favorited ? style.btnAdd : ''} onClick={() => handleFavoriteArticle(article.favoritesCount, article.slug, article.favorited)}><i class="fa-solid fa-heart"></i> {article.favoritesCount}</button>
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