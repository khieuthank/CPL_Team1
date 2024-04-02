import React, { useState, useEffect } from 'react';
import style from './Comment.module.css';
import { useParams } from 'react-router-dom';
const Comments = () => {

    const { slug } = useParams();
    const [article, setArticle] = useState({});
    const [loading, setLoading] = useState(true);
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

    return (
        <div className={style.containerCard}>

            <textarea placeholder='Write a comment...'></textarea>

            <div className={style.cardFooter}>
                {/* <img src={article.author.image} alt="Image" /> */}
                <button>Post Comment</button>
            </div>
        </div>
    );
};

export default Comments;