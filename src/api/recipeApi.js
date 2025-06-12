// src/api/recipeApi.js
import axios from 'axios';

const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1/';

// Search for meals by name (returns full details)
export const searchRecipes = async (query) => {
    try {
        const response = await axios.get(`${API_BASE_URL}search.php?s=${query}`);
        return response.data.meals || [];
    } catch (error) {
        console.error("Error searching recipes:", error);
        throw error;
    }
};

// Get full meal details by ID
export const getRecipeDetails = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}lookup.php?i=${id}`);
        return response.data.meals[0];
    } catch (error) {
        console.error("Error getting recipe details:", error);
        throw error;
    }
};

// Get list of all categories for filtering
export const listCategories = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}list.php?c=list`);
        return response.data.meals || [];
    } catch (error) {
        console.error("Error fetching category list:", error);
        throw error;
    }
}

// Get list of all areas (cuisines) for filtering
export const listAreas = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}list.php?a=list`);
        return response.data.meals || [];
    } catch (error) {
        console.error("Error fetching area list:", error);
        throw error;
    }
}

// Fetches a list of meals by a filter, then gets the full details for each meal.
export const fetchRecipesByFilter = async (filterValue, filterType) => {
    const endpoint = filterType === 'c' ? 'filter.php?c=' : 'filter.php?a=';
    try {
        const listResponse = await axios.get(`${API_BASE_URL}${endpoint}${filterValue}`);
        const simplifiedMeals = listResponse.data.meals || [];
        if (simplifiedMeals.length === 0) return [];
        const detailPromises = simplifiedMeals.map(meal => getRecipeDetails(meal.idMeal));
        const fullRecipes = await Promise.all(detailPromises);
        return fullRecipes;
    } catch (error) {
        console.error(`Error fetching recipes by filter:`, error);
        throw error;
    }
};

// --- NEW: Function to get multiple random recipes ---
export const getRandomRecipes = async (count = 3) => {
    try {
        const promises = [];
        for (let i = 0; i < count; i++) {
            promises.push(axios.get(`${API_BASE_URL}random.php`));
        }
        const responses = await Promise.all(promises);
        const recipes = responses.map(response => response.data.meals[0]);
        return recipes;
    } catch (error) {
        console.error("Error fetching random recipes:", error);
        throw error;
    }
};