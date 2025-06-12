// src/pages/HomePage.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { searchRecipes, listCategories, listAreas, fetchRecipesByFilter, getRandomRecipes } from '../api/recipeApi';
import RecipeCard from '../components/RecipeCard';
import SkeletonCard from '../components/SkeletonCard';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/solid';

const HomePage = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [allRecipes, setAllRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  
  const [categories, setCategories] = useState([]);
  const [areas, setAreas] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  
  // --- NEW: State for initial random recipes ---
  const [randomSuggestions, setRandomSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    let ignore = false; // Flag to prevent state updates after component unmounts

    const fetchInitialData = async () => {
      // Fetch filter options
      try {
        const [categoryData, areaData] = await Promise.all([listCategories(), listAreas()]);
        if (!ignore) {
            setCategories(categoryData);
            setAreas(areaData);
        }
      } catch (err) { console.error("Failed to fetch filter options", err); }
      
      // Fetch random suggestions
      setLoadingSuggestions(true);
      try {
        const randomData = await getRandomRecipes(3);
        if (!ignore) {
            setRandomSuggestions(randomData);
        }
      } catch (err) {
        console.error("Failed to fetch random suggestions", err);
      } finally {
        if (!ignore) {
            setLoadingSuggestions(false);
        }
      }
    };
    
    fetchInitialData();

    // Cleanup function: If the component unmounts, set the ignore flag.
    return () => {
      ignore = true;
    };
  }, []); // Empty dependency array ensures this runs only on initial mount
  
  const executeSearch = useCallback(async (searchQuery, category, area) => {
    setLoading(true);
    setError('');
    let results = [];
    try {
      if (searchQuery) {
        results = await searchRecipes(searchQuery);
      } else if (category) {
        results = await fetchRecipesByFilter(category, 'c');
      } else if (area) {
        results = await fetchRecipesByFilter(area, 'a');
      }
    } catch (err) {
      setError('Failed to fetch recipes. Please try again later.');
    } finally {
      setAllRecipes(results);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    if (query.trim() === '') {
        executeSearch(null, selectedCategory, selectedArea);
    }
  }, [selectedCategory, selectedArea, query, executeSearch]);

  useEffect(() => {
    let recipes = [...allRecipes];
    if (selectedCategory) {
        recipes = recipes.filter(r => r.strCategory === selectedCategory);
    }
    if (selectedArea) {
        recipes = recipes.filter(r => r.strArea === selectedArea);
    }
    
    setFilteredRecipes(recipes);
    
    if (allRecipes.length > 0 && recipes.length === 0) {
      setError("No recipes match all your selected criteria.");
    } else if (!loading) {
      setError("");
    }
  }, [allRecipes, selectedCategory, selectedArea, loading]);


  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim() === '' && !selectedCategory && !selectedArea) {
        setError("Please enter a search term or select a filter.");
        return;
    }
    executeSearch(query.trim(), selectedCategory, selectedArea);
  };
  
  const handleSelectCategory = (category) => {
    setSelectedCategory(prev => prev === category ? null : category);
  }

  const handleSelectArea = (area) => {
    setSelectedArea(prev => prev === area ? null : area);
  }

  const handleClearAllFilters = () => {
    const shouldSearch = (selectedCategory || selectedArea) && query.trim() === '';
    setSelectedCategory(null);
    setSelectedArea(null);
    if (shouldSearch) {
      setAllRecipes([]);
    }
    setIsDropdownOpen(false);
  };
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="text-center my-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-300 ease-in-out">Culinary Compass</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2 transition-colors duration-300 ease-in-out">
          Enter a dish or ingredient, or explore by selecting a filter.
        </p>
      </div>
      
      <div className="flex justify-center mb-4">
        <div className="relative w-full md:w-2/3 lg:w-1/2" ref={dropdownRef}>
          <form onSubmit={handleSearchSubmit} className="flex">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-l-lg hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white dark:border-gray-600 transition-colors duration-300 ease-in-out"
            >
              Filters <ChevronDownIcon className="w-4 h-4 ml-1" />
            </button>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search and/or apply filters..."
              className="block p-2.5 w-full z-0 text-sm text-gray-900 bg-white border border-l-0 border-gray-300 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white transition-colors duration-300 ease-in-out"
            />
            <button type="submit" className="bg-orange-500 text-white px-6 py-2 rounded-r-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-300 ease-in-out">
              Search
            </button>
          </form>

          {isDropdownOpen && (
             <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-700 rounded-md shadow-lg z-20 transition-colors duration-300 ease-in-out">
             <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                 <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-100 transition-colors duration-300 ease-in-out">Category</h3>
                 <ul className="max-h-48 overflow-y-auto text-sm">
                   {categories.map((cat) => (
                     <li key={cat.strCategory}>
                       <a href="#" onClick={(e) => { e.preventDefault(); handleSelectCategory(cat.strCategory); }}
                          className={`block p-1.5 rounded ${selectedCategory === cat.strCategory ? 'bg-orange-500 text-white' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300 ease-in-out'}`}>
                         {cat.strCategory}
                       </a>
                     </li>
                   ))}
                 </ul>
               </div>
               <div>
                 <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-100 transition-colors duration-300 ease-in-out">Area (Cuisine)</h3>
                 <ul className="max-h-48 overflow-y-auto text-sm">
                   {areas.map((area) => (
                     <li key={area.strArea}>
                       <a href="#" onClick={(e) => { e.preventDefault(); handleSelectArea(area.strArea); }}
                          className={`block p-1.5 rounded ${selectedArea === area.strArea ? 'bg-orange-500 text-white' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300 ease-in-out'}`}>
                         {area.strArea}
                       </a>
                     </li>
                   ))}
                 </ul>
               </div>
             </div>
             <div className="p-2 border-t border-gray-200 dark:border-gray-600 transition-colors duration-300 ease-in-out">
               <button onClick={handleClearAllFilters} className="w-full text-center text-sm p-2 rounded text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-red-500 font-medium transition-colors duration-300 ease-in-out">
                 Clear All Filters
               </button>
             </div>
           </div>
          )}
        </div>
      </div>
      
      <div className="text-center mb-8 h-6">
        { (selectedCategory || selectedArea) && (
            <div className="flex justify-center items-center gap-2 text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300 ease-in-out">
                <span className="font-semibold">Active Filters:</span>
                {selectedCategory && (
                     <div className="flex items-center bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 transition-colors duration-300 ease-in-out">
                        <span className="dark:text-gray-100">{selectedCategory}</span>
                        <button onClick={() => handleSelectCategory(selectedCategory)} className="ml-2 hover:text-red-500">
                            <XMarkIcon className="w-4 h-4" />
                        </button>
                    </div>
                )}
                 {selectedArea && (
                     <div className="flex items-center bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 transition-colors duration-300 ease-in-out">
                        <span className="dark:text-gray-100">{selectedArea}</span>
                        <button onClick={() => handleSelectArea(selectedArea)} className="ml-2 hover:text-red-500">
                            <XMarkIcon className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        )}
      </div>
      
      {error && <p className="text-center text-red-500 my-4 font-medium">{error}</p>}
      
      {!loading && filteredRecipes.length === 0 && !error && (
        <div className="text-center text-gray-500 dark:text-gray-400 my-10 transition-colors duration-300 ease-in-out">
            <p className="text-lg font-medium">Welcome to Culinary Compass!</p>
            <p>Your next delicious meal is just a search away.</p>

            <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200 transition-colors duration-300 ease-in-out">Recommendations</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 max-w-4xl mx-auto">
                    {loadingSuggestions 
                        ? Array.from({ length: 3 }).map((_, index) => <SkeletonCard key={index} />)
                        : randomSuggestions.map((recipe) => <RecipeCard key={recipe.idMeal} recipe={recipe} />)
                    }
                </div>
            </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 12 }).map((_, index) => <SkeletonCard key={index} />)
          : filteredRecipes.map((recipe) => <RecipeCard key={recipe.idMeal} recipe={recipe} />)}
      </div>
    </div>
  );
};

export default HomePage;