import React from 'react';
import style from './Articles.module.css';
import { useState, useEffect } from 'react';
import { formatDate } from '../../utils/utils';
import { useNavigate } from 'react-router-dom';


const Articles = () => {

    const [tags, setTags] = useState([]);
    const [isloadTag, setIsLoadTag] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [articles, setArticles] = useState([]);
    const [isloadArticles, setIsLoadArticles] = useState(true);
    const [totalPages, setTotalPages] = useState(1);

    const nav = useNavigate();

    const itemsPerPage = 10;

    useEffect(() => {
        const apiUrl = 'https://api.realworld.io/api/tags';
        fetch(apiUrl)
          .then(response => response.json())
          .then(data => {
            setTags(data);
            setIsLoadTag(false);
        })
          .catch(error => console.error('Error fetching tags:', error));
      }, []);

      useEffect(() => {
        const apiUrl = `https://api.realworld.io/api/articles?limit=${itemsPerPage}&offset=${(currentPage - 1) * itemsPerPage}`;
        fetch(apiUrl)
          .then(response => response.json())
          .then(data => {
            setArticles(data.articles);
            setTotalPages(Math.ceil(data.articlesCount / itemsPerPage));
            setIsLoadArticles(false);
        })
          .catch(error => console.error('Error fetching tags:', error));
      }, [currentPage]);

      const handlePageChange = (page) => {
        setCurrentPage(page);
      };

      const handleToArticleDetails = (slug) => {
        nav(`/article/${slug}`);
      }


    return (
        <div className={style.container}>
            <div className={style.banner}>
                <h1>conduit</h1>
                <p>A place to share your knowledge.</p>
            </div>
            <div className='container mt-4'>
                <div className='row'>
                    <div className='col-md-9'>
                        <div className={style.titleGlobal}>
                            <a href="">Global Feed</a>
                        </div>
                        {
                            isloadArticles ? (<p>Loading...</p>) : (
                                articles.map(article => (
                                    <div className={style.article}>
                                    <div className={style.articleInfo}>
                                        <div className={style.info}>
                                            <img src={article.author.image} alt="" />
                                            <div className={style.infoDetails}>
                                                <a href="">{article.author.username }</a>
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
                    <div className='col-md-3'>
                        <div className={style.tags}>
                            <div className={style.titleTag}>
                                <p>Popular Tags</p>
                            </div>
                            {
                                isloadTag ? (<p>Loading...</p>) : (
                                    <div className={style.listTag}>
                                {
                                    tags.tags.map((tag, index) => (
                                        <a key={index} href="">{tag}</a>
                                      ))
                                }
                            </div>
                                )
                            }
                            
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    );
};

export default Articles;