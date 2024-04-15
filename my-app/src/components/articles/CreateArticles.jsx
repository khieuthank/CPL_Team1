import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AddArticle.css';

const CreateArticles = () => {
    // State variables
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [body, setBody] = useState('');
    const [tagList, setTagList] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    
    const navigate = useNavigate();

  
    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token'); 

     
        const tags = tagList.split(',').map(tag => tag.trim());

        const articleData = {
            article: {
                title,
                description,
                body,
                tagList: tags
            }
        };

        try {
            const response = await axios.post(
                'https://api.realworld.io/api/articles',
                articleData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

           
            window.alert('Article created successfully!');
            setErrorMessage('');

           
            setTitle('');
            setDescription('');
            setBody('');
            setTagList('');

            console.log('Article created:', response.data.article);

           
            //navigate(`/article/${slug}`);
            navigate(`/`);
        } catch (error) {
            // Handle error
            setErrorMessage('Error creating article. Please try again.');
            console.error('Error creating article:', error);
        }
    };

    return (
        <div className='container-create-article mt-5'>
            <h2>Create Article</h2>

            {/* Error Message */}
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

            <form onSubmit={handleSubmit}>
                {/* Article Title */}
                <div className="mb-3">
                    <input
                        type='text'
                        className='form-control'
                        placeholder='Article Title'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                {/* Article Description */}
                <div className="mb-3">
                    <input
                        type='text'
                        className='form-control'
                        placeholder='What is the article about?'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>

                {/* Article Body */}
                <div className="mb-3">
                    <textarea
                        className='form-control'
                        placeholder='Write your article'
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        required
                    ></textarea>
                </div>

                {/* Tag List */}
                <div className="mb-3">
                    <input
                        type='text'
                        className='form-control'
                        placeholder='Enter tags (comma-separated)'
                        value={tagList}
                        onChange={(e) => setTagList(e.target.value)}
                    />
                </div>

                {/* Submit Button */}
                <div className="mb-3">
                    <button
                        type="submit"
                        className='btn btn-success'
                        style={{ float: 'right' }}
                    >
                        Create Article
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateArticles;
