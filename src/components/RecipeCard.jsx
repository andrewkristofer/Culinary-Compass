// src/components/RecipeCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline';
import { useFavorites } from '../contexts/FavoritesContext';

// Accept a new 'onToggleFavorite' prop to override the context function
const RecipeCard = ({ recipe, isFadingOut = false, onToggleFavorite }) => {
  const { isFavorited, toggleFavorite: contextToggleFavorite } = useFavorites();
  const isCurrentlyFavorited = isFavorited(recipe.idMeal);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // If an override function is provided, use it. Otherwise, use the one from the context.
    if (onToggleFavorite) {
      onToggleFavorite(recipe);
    } else {
      contextToggleFavorite(recipe);
    }
  };

  const cardClasses = `
    bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl group relative
    transition-opacity duration-300 ease-in-out
    transition-colors duration-300 ease-in-out 
    ${isFadingOut ? 'opacity-0' : 'opacity-100'}
  `;

  return (
    <div className={cardClasses}>
      <button
        onClick={handleFavoriteClick}
        className="absolute top-2 right-2 bg-white/70 backdrop-blur-sm rounded-full p-1.5 z-10 hover:scale-110 transition-transform"
        aria-label="Toggle Favorite"
      >
        {isCurrentlyFavorited ? (
          <HeartIconSolid className="h-6 w-6 text-red-500" />
        ) : (
          <HeartIconOutline className="h-6 w-6 text-red-500" />
        )}
      </button>

      <Link to={`/recipe/${recipe.idMeal}`}>
        <img className="w-full h-48 object-cover" src={recipe.strMealThumb} alt={recipe.strMeal} />
        <div className="p-4">
          <h3 className="font-bold text-lg mb-2 truncate text-gray-900 dark:text-white transition-colors duration-300 ease-in-out">{recipe.strMeal}</h3>
          <p className="text-gray-700 dark:text-gray-300 text-sm transition-colors duration-300 ease-in-out">
            {recipe.strCategory} | {recipe.strArea}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default RecipeCard;