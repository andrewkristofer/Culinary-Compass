// src/pages/RecipeDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getRecipeDetails } from '../api/recipeApi';
// --- NEW: Import context hook ---
import { useFavorites } from '../contexts/FavoritesContext';

const RecipeDetailPage = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // --- NEW: Get favorite logic from context ---
  const { isFavorited, toggleFavorite } = useFavorites();
  const isCurrentlyFavorited = recipe ? isFavorited(recipe.idMeal) : false;

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const details = await getRecipeDetails(id);
        setRecipe(details);
      } catch (error) {
        console.error("Failed to fetch recipe details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleToggleFavorite = () => {
    if (recipe) {
      toggleFavorite(recipe);
    }
  };

  if (loading) return <div className="text-center p-10 font-bold text-lg">Loading...</div>;
  if (!recipe) return <div className="text-center p-10 font-bold text-lg">Recipe not found.</div>;

  const ingredients = Object.keys(recipe)
    .filter(key => key.startsWith('strIngredient') && recipe[key])
    .map(key => `${recipe[key]} - ${recipe[`strMeasure${key.slice(13)}`]}`);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 transition-colors duration-300 ease-in-out">
        <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-2 transition-colors duration-300 ease-in-out">{recipe.strMeal}</h1>
        <div className="flex items-center mb-4">
          <span className="text-lg text-gray-600 dark:text-gray-300 transition-colors duration-300 ease-in-out">{recipe.strCategory} | {recipe.strArea}</span>
          <button onClick={handleToggleFavorite} className={`ml-4 px-3 py-1 text-sm font-semibold rounded-full transition-colors duration-300 ease-in-out ${isCurrentlyFavorited ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-200 text-gray-800'}`}>
            {isCurrentlyFavorited ? '❤️ Saved' : '🤍 Save to Favorites'}
          </button>
        </div>
        
        <div className="md:flex md:space-x-8">
          <img src={recipe.strMealThumb} alt={recipe.strMeal} className="w-full h-80 md:w-1/3 md:h-auto object-cover rounded-lg shadow-md mb-4 md:mb-0"/>
          <div className="md:w-2/3">
            <h2 className="text-2xl font-bold border-b-2 border-orange-400 pb-2 mb-4 dark:text-gray-100 transition-colors duration-300 ease-in-out">Ingredients</h2>
            <ul className="list-disc list-inside space-y-1">
              {ingredients.map((ing, index) => (
                <li key={index} className="text-gray-700 dark:text-gray-300 transition-colors duration-300 ease-in-out">{ing}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold border-b-2 border-orange-400 pb-2 mb-4 dark:text-gray-100 transition-colors duration-300 ease-in-out">Instructions</h2>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed transition-colors duration-300 ease-in-out">{recipe.strInstructions}</p>
        </div>
        
        {recipe.strYoutube && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold border-b-2 border-orange-400 pb-2 mb-4 dark:text-gray-100 transition-colors duration-300 ease-in-out">Video Tutorial</h2>
            <div className="w-full aspect-video">
              <iframe 
                src={`https://www.youtube.com/embed/${recipe.strYoutube.split('v=')[1]}`}
                title={recipe.strMeal}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-lg"
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeDetailPage;