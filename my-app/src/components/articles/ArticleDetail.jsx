import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import style from './ArticleDetail.module.css';

const ArticleDetail = () => {




    // ------------------------------------------------------------------
    const [articles, setArticles] = useState([]);
    const [tags, setTags] = useState([]);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [articlesResponse, tagsResponse] = await Promise.all([
                    fetch('https://api.realworld.io/api/articles'),
                    fetch('https://api.realworld.io/api/tags')
                ]);

                if (!articlesResponse.ok || !tagsResponse.ok) {
                    throw new Error('Failed to fetch data');
                }

                const articlesData = await articlesResponse.json();
                const tagsData = await tagsResponse.json();

                setArticles(articlesData.articles);
                setTags(tagsData.tags);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchData();
    }, []);

    // --------------------------------------------------------------
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
        <div>
            {articles.map((article, index) => (
                <div key={index} className={style.containerAll}>
                    <div className={style.bannerArticleDetail}>
                        <h1>{article.title}</h1>
                        <div className={style.articleContent}>
                            <div className={style.articleImage}>
                                <img src={article.author.image} alt="Image" />
                                <div>
                                    <a href="">{article.author.username}</a>
                                    <span className="date">
                                        {new Date(article.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>

                            </div>
                            <div className={style.articleButton}>
                                <button className={style.buttonFollow}><i className="fa-solid fa-plus"></i> Follow Maksim Esteban</button>
                                <button className={style.buttonFavorite}><i className="fa-solid fa-heart"></i> Favorite Article (355)</button>
                            </div>
                        </div>
                    </div>
                    <div className={style.containerArticleDetail}>
                        <p className={style.containerDescription}>{article.description}</p>
                        <p>{article.body}</p>
                    </div>
                    <ul className={style.tagList}>
                        {article.tagList.map(tag => (
                            <li key={tag} className={style.tagItem}>{tag}</li>
                        ))}
                    </ul>
                </div>
            ))}

            <div className={style.linkSign}>
                <a href="">Sign in</a> or <a href="">Sign up</a> to add comments on this article
            </div>
        </div>
    );
};

export default ArticleDetail;