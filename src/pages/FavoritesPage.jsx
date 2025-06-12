// src/pages/FavoritesPage.jsx
import React, { useState } from 'react';
import RecipeCard from '../components/RecipeCard';
import { useFavorites } from '../contexts/FavoritesContext';

const FavoritesPage = () => {
  const { favorites, toggleFavorite, isFavorited } = useFavorites();
  
  const [fadingOutIds, setFadingOutIds] = useState(new Set());

  const handleUnfavorite = (recipe) => {
    // This function will only handle the removal animation
    if (isFavorited(recipe.idMeal)) {
      setFadingOutIds(prev => new Set(prev).add(recipe.idMeal));

      setTimeout(() => {
        toggleFavorite(recipe); // Call the real context function after the animation
        setFadingOutIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(recipe.idMeal);
          return newSet;
        });
      }, 300); 
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center my-8 dark:text-gray-100 transition-colors duration-300 ease-in-out">My Favorite Recipes</h1>
      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* RecipeCards will inherit the transition styles automatically */}
          {favorites.map((recipe) => (
            <RecipeCard 
               key={recipe.idMeal}
               recipe={recipe} 
               isFadingOut={fadingOutIds.has(recipe.idMeal)}
               onToggleFavorite={handleUnfavorite}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out">You haven't saved any favorites yet.</p>
      )}
    </div>
  );
};

export default FavoritesPage;