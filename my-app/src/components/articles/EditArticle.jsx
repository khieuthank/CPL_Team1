import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AddArticle.css';

const EditArticle = () => {
    // State variables
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [body, setBody] = useState('');
    const [tagList, setTagList] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // useNavigate hook
    const navigate = useNavigate();
    const { slug } = useParams(); // Get the slug from the URL

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await axios.get(`https://api.realworld.io/api/articles/${slug}`);
                const { article } = response.data;
                setTitle(article.title);
                setDescription(article.description);
                setBody(article.body);
                setTagList(article.tagList.join(', ')); // Convert array to comma-separated string
            } catch (error) {
                console.error('Error fetching article:', error);
            }
        };

        fetchArticle();
    }, [slug]);

    // Handle form submission
// Handle form submission
const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    let tags = tagList.split(',').map(tag => tag.trim());
    tags = tags.filter(tag => tag); // Remove empty tags

    const articleData = {
        article: {
            title,
            description,
            body,
            tagList: tags
        }
    };

    try {
        const response = await axios.put(
            `https://api.realworld.io/api/articles/${slug}`,
            articleData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        window.alert('Article updated successfully!');
        setErrorMessage('');

        navigate('/');
    } catch (error) {
        setErrorMessage('Error updating article. Please try again.');
        console.error('Error updating article:', error);
    }
};

    return (
        <div className='container-create-article mt-5'>
            <h2>Edit Article</h2>

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
                        Update Article
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditArticle;
