import React from 'react';
import style from './Articles.module.css';
import { useState, useEffect } from 'react';

import ArticlesTag from './ArticlesTag';
import GlobalFeed from './GlobalFeed';
import YourFeed from './YourFeed';
import { useAuth } from '../context/AuthContext';


const Articles = () => {

    const { isLoggedIn } = useAuth();

    const [tags, setTags] = useState([]);
    const [isloadTag, setIsLoadTag] = useState(true);
    const [tagSelect, setTagSelect] = useState(null);
    const [isPage, setIsPage] = useState('globalfeed');
    const [token, setToken] = useState(null);

    console.log(' logger' + isLoggedIn);

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
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            setIsPage('yourfeed');
        }
        else{
            setIsPage('globalfeed');
        }
    
    }, [isLoggedIn]);

    const handleClickTags = (tag) => {
        setTagSelect(tag);
        setIsPage('tagfeed');
    }

    const handleToPage = (page) =>{
        if(page === 'yourfeed'){
            setIsPage('yourfeed');
        }
        if(page === 'globalfeed'){
            setIsPage('globalfeed');
        }
        if(page === 'tagfeed'){
            setIsPage('tagfeed');
        }

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
                            {isLoggedIn && (<a className={isPage === 'yourfeed' ? style.aActive : ''} onClick={() => handleToPage('yourfeed')}>Your feed</a>)}
                            <a className={isPage === 'globalfeed' ? style.aActive : ''} onClick={() => handleToPage('globalfeed')}>Global Feed</a>
                            {tagSelect !== null && (<a className={isPage === 'tagfeed' ? style.aActive : ''} onClick={() => handleToPage('tagfeed')}>#{tagSelect}</a>)}
                        </div>
                        {
                            <div className={isPage == 'tagfeed' ? null : style.disable}><ArticlesTag tag={tagSelect}></ArticlesTag></div>
                        }
                        {
                            <div className={isPage == 'globalfeed' ? null : style.disable}><GlobalFeed></GlobalFeed></div>
                        }
                        {
                             <div className={isPage == 'yourfeed' ? null : style.disable}><YourFeed></YourFeed></div>
                        }

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
                                                <a key={index} className={tag === tagSelect ? style.tagSelected : null} onClick={() => handleClickTags(tag)}>{tag}</a>
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