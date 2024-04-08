import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import style from './ArticleDetail.module.css';
import { Link, useNavigate } from 'react-router-dom';
import Comment from '../comments/Comments'
const ArticleDetail = () => {


    const { slug } = useParams();
    
    // ------------------------------------------------------------------
    const [article, setArticle] = useState({});
    const [loading, setLoading] = useState(true);
    const [tags, setTags] = useState([]);
    const [error, setError] = useState(null);
    const [user, setUser] = useState({});

    const token = localStorage.getItem('token');

    const nav = useNavigate();

    useEffect(() => {
        if (token) {
            fetch(`https://api.realworld.io/api/articles/${slug}`, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            })
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

        } else {
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
        }

    }, []);

    useEffect(() => {
        if (token && !loading) {
            fetch(`https://api.realworld.io/api/profiles/${article.author.username}`, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch article');

                    }
                    return response.json();
                })
                .then(data => {
                    setUser(data.profile);
                    console.log(data);
                })
                .catch(error => {
                    setError(error.message);

                });
        }
    }, [loading]);


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
    // -------------------------------------------------------------------------

    const handleFollowClick = () => {
        if (token == null) {
            nav("/users/login");
        }
        else {
            if (user.following) {
                fetch(`https://api.realworld.io/api/profiles/${article.author.username}/follow`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Failed to fetch article');

                        }
                        return response.json();
                    })
                    .then(data => {
                        setUser(data.profile);
                        console.log(data);
                    })
                    .catch(error => {
                        setError(error.message);

                    });
            } else {
                const profileData = {
                    profile: {
                        following: true
                    }
                };

                fetch(`https://api.realworld.io/api/profiles/${article.author.username}/follow`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Token ${token}`
                    },
                    body: JSON.stringify(profileData)
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Failed to fetch article');

                        }
                        return response.json();
                    })
                    .then(data => {
                        setUser(data.profile);
                        console.log(data);
                    })
                    .catch(error => {
                        setError(error.message);

                    });
            }
        }
    };

    const handleFavoriteClick = (slug) => {
        const apiUrl = `https://api.realworld.io/api/articles/${slug}/favorite`;
        if (article.favorited) {
            fetch(apiUrl, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Token ${token}`
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    setArticle(data.article)
                    console.log(data);
                })
                .catch(error => {
                    console.error('Error occurred while updating favorite:', error);
                });
        } else {
            const newData = {
                article: {
                    favoritesCount: article.favoritesCount + 1
                }
            }
            fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
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
                    setArticle(data.article)
                })
                .catch(error => {
                    console.error('Có lỗi xảy ra khi cập nhật:', error);
                });
        }
    };


    //---------------------
    const handleEditClick = () => {
        nav(`/edit/${article.slug}`);
    };

    const handleDeleteClick = () => {
        const isConfirmed = window.confirm('Are you sure you want to delete this article?');
        
        if (isConfirmed) {
            fetch(`https://api.realworld.io/api/articles/${article.slug}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Token ${token}`
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to delete article');
                }
                nav('/');
            })
            .catch(error => {
                setError(error.message);
            });
        }
    };
    
    // ----------------------------------------------------------------------------------------------
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
                                    <Link to={`/profileAuthor/${article.author.username}`}>{article.author.username}</Link>
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
                                    {token && article.author.username === user.username ? (
                                        <>
                                            <button onClick={handleEditClick}>
                                                <i className="fa-solid fa-edit"></i> Edit Article
                                            </button>
                                            <button onClick={handleDeleteClick}>
                                                <i className="fa-solid fa-trash"></i> Delete Article
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button className={`${style.buttonFollow} ${user.following ? style.followActive : ''}`} onClick={handleFollowClick}>
                                                <i className="fa-solid fa-plus"></i> {user.following ? 'Unfollow' : 'Follow'} {article.author.username}
                                            </button>
                                            <button className={`${style.buttonFavorite} ${article.favorited ? style.faActive : ''}`} onClick={() => handleFavoriteClick(article.slug)}>
                                                <i className="fa-solid fa-heart"></i> {article.favorited ? 'Unfavorite' : 'Favorite'} Article ({article.favoritesCount})
                                            </button>
                                        </>
                                    )}
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

                        <div className={`d-flex justify-content-center align-items-center`}>
                            {token ? (
                                <Comment></Comment>
                            ) : (
                                <div className={`d-flex flex-column align-items-center ${style.linkSign}`}>
                                    <>
                                        <Link to="/users/login" className="btn btn-primary">Sign In</Link>
                                        <span className="mx-2">or</span>
                                        <Link to="/users/register" className="btn btn-secondary">Sign Up</Link>
                                        <span>to add comments on this article</span>
                                    </>
                                </div>
                            )}
                        </div>

                    </div>
                )

            }


        </div>
    );
};

export default ArticleDetail;