import React from 'react';
import style from './Articles.module.css';
import { useState, useEffect } from 'react';

import ArticlesTag from './ArticlesTag';
import GlobalFeed from './GlobalFeed';


const Articles = () => {

    const [tags, setTags] = useState([]);
    const [isloadTag, setIsLoadTag] = useState(true);
    const [tagSelect, setTagSelect] = useState(null);
    const [isPageTag, setIsPageTag] = useState(false);
   

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


    const handleClickTags = (tag) => {
         setTagSelect(tag);
         setIsPageTag(true);
    }

    const handleToPageglobal = () =>{
        setIsPageTag(false);
        
    }

    const handleToPageTag = () =>{
        setIsPageTag(true);
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
                            <a className={isPageTag ? '' : style.aActive} onClick={handleToPageglobal}>Global Feed</a>
                            {tagSelect !== null && (<a className={!isPageTag ? '' : style.aActive} onClick={handleToPageTag}>#{tagSelect}</a>)}
                        </div>
                        {
                            <div className={isPageTag ? null : style.disable }><ArticlesTag tag={tagSelect}></ArticlesTag></div>
                        }
                        {
                            <div className={!isPageTag ? null : style.disable}><GlobalFeed></GlobalFeed></div>
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