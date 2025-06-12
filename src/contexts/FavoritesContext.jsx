// src/contexts/FavoritesContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
// --- NEW: Import the js-cookie library ---
import Cookies from 'js-cookie';

const FavoritesContext = createContext();

export const useFavorites = () => {
  return useContext(FavoritesContext);
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  // --- UPDATED: Load favorites from cookies on initial render ---
  useEffect(() => {
    let ignore = false; 

    // Get the cookie. It will be a JSON string.
    const savedFavoritesCookie = Cookies.get('favorites');

    if (savedFavoritesCookie) {
      try {
        const savedFavorites = JSON.parse(savedFavoritesCookie);
        if (!ignore) {
          setFavorites(savedFavorites);
        }
      } catch (error) {
        console.error("Failed to parse favorites from cookie", error);
        if (!ignore) {
          setFavorites([]);
        }
      }
    }

    // Cleanup function for React's StrictMode
    return () => {
      ignore = true;
    };
  }, []); 

  // --- UPDATED: Save favorites to a cookie whenever they change ---
  useEffect(() => {
    try {
      // Set the cookie with a 1-year expiration
      Cookies.set('favorites', JSON.stringify(favorites), { 
        expires: 365,
        sameSite: 'strict' // Recommended for security
      });
    } catch (error) {
        console.error("Failed to save favorites to cookie", error);
    }
  }, [favorites]);

  const toggleFavorite = (recipe) => {
    setFavorites(prevFavorites => {
      const isFavorite = prevFavorites.some(fav => fav.idMeal === recipe.idMeal);
      if (isFavorite) {
        return prevFavorites.filter(fav => fav.idMeal !== recipe.idMeal);
      } else {
        const recipeSummary = {
          idMeal: recipe.idMeal,
          strMeal: recipe.strMeal,
          strMealThumb: recipe.strMealThumb,
          strCategory: recipe.strCategory,
          strArea: recipe.strArea,
        };
        return [...prevFavorites, recipeSummary];
      }
    });
  };

  const isFavorited = (recipeId) => {
    return favorites.some(fav => fav.idMeal === recipeId);
  }

  const value = {
    favorites,
    toggleFavorite,
    isFavorited,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};