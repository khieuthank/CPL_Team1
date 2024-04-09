import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FavoriteContext = createContext();



export const FavoriteProvider = ({ children }) => {
    // const nav = useNavigate();
    const [favorite, setFavorites] = useState({});

    const handleFavorite = (favorite, slug, isFavorite, storedToken, articles) => {
        const apiUrl = `https://api.realworld.io/api/articles/${slug}/favorite`;
        if (storedToken == null) {
            //nav("/users/login");
        } else {
            const newData = {
                article: {
                    favoritesCount: isFavorite ? favorite - 1 : favorite + 1
                }
            };
            fetch(apiUrl, {
                method: isFavorite ? 'DELETE' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${storedToken}`
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
                    console.log(data);
                    setFavorites(data.article);
                })
                .catch(error => {
                    console.error('Error occurred while updating favorite:', error);
                });
        }
    };
    return (
        <FavoriteContext.Provider value={{ favorite, handleFavorite }}>
            {children}
        </FavoriteContext.Provider>
    );
};

export const useFavorite = () => useContext(FavoriteContext);
