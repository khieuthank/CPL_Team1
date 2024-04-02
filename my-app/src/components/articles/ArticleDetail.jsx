import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import style from './ArticleDetail.module.css';
import { Link } from 'react-router-dom';
import Comment from '../comments/Comments'
const ArticleDetail = () => {


    const { slug } = useParams();
    console.log(slug);
    // ------------------------------------------------------------------
    const [article, setArticle] = useState({});
    const [loading, setLoading] = useState(true);
    const [tags, setTags] = useState([]);
    const [error, setError] = useState(null);
    const [token, setToken] = useState('');
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);
    useEffect(() => {
        fetch(`https://api.realworld.io/api/articles/${slug}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch article');

                }
                return response.json();
            })
            .then(data => {
                setArticle(data.article);
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);

            });
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
            {
                loading ? (<p>Loading...</p>) : (
                    <div className={style.containerAll}>
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
                        <div className={style.linkSign}>


                        {token ? (
                            <Comment></Comment>
                        ) : (
                            <>
 <Link  to="/users/login">Sign In</Link> or <Link  to="/users/register">Sign Up</Link> to add comments on this article
                            </>
                        )}
                    </div>


                    </div>
                )

            }


        </div>
    );
};

export default ArticleDetail;