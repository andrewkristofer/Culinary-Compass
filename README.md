# 🍳 Culinary Compass

A sleek and responsive recipe discovery application that allows users to search for meals based on ingredients, cuisine, or dietary restrictions, powered by TheMealDB API.

### [➡️ Live Demo](https://culinary-compass-eight.vercel.app/)

-----

## ✨ Features

Culinary Compass is a feature-rich application designed to provide a seamless and enjoyable recipe discovery experience.

  * **Dynamic Recipe Search:** Instantly search thousands of recipes by name or ingredient.
  * **Advanced Filtering:**
      * Filter search results by **Category** and/or **Area (Cuisine)**.
      * Filters can be combined for powerful, specific queries.
      * Easily toggle filters on and off or clear them with a single click.
  * **Detailed Recipe View:** Click on any recipe to see a full-page view with:
      * A high-quality image of the dish.
      * A complete list of ingredients with measurements.
      * Step-by-step cooking instructions.
      * An embedded YouTube video tutorial, if available.
  * **Persistent Favorites System:**
      * Save your favorite recipes with a single click on the heart icon.
      * Favorites are saved to your browser's cookies, persisting across sessions.
      * A dedicated "Favorites" page to view all your saved recipes.
      * Unfavoriting an item on the Favorites page triggers a smooth fade-out animation.
  * **Dual-Theme (Light & Dark Mode):**
      * Seamlessly switch between a light and dark theme.
      * Your preference is saved and will be remembered on your next visit.
      * The theme transition is animated with a smooth fade for a polished feel.
      * Automatically detects your system's preferred color scheme on your first visit.
  * **User-Friendly Interface:**
      * **Initial Suggestions:** The homepage greets you with 3 random recipe suggestions to inspire you.
      * **Loading Skeletons:** Skeleton loaders provide a better user experience while data is being fetched.
      * **Fully Responsive:** The layout is optimized for all screen sizes, from mobile phones to desktop monitors.

-----

## 🛠️ Technologies & Tools Used

This project was built using a modern frontend stack, focusing on performance, scalability, and developer experience.

| Technology         | Description                                     |
| ------------------ | ----------------------------------------------- |
| **React** | A JavaScript library for building user interfaces |
| **Vite** | A next-generation frontend tooling for speed    |
| **Tailwind CSS** | A utility-first CSS framework for rapid UI design |
| **React Router** | For client-side routing and navigation          |
| **React Context** | For global state management (Theme & Favorites) |
| **Axios** | For making asynchronous HTTP requests to the API|
| **Heroicons** | A beautiful, free set of SVG icons             |
| **js-cookie** | A lightweight library for handling browser cookies|
| **TheMealDB API** | The external API providing all recipe data      |

-----

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You need to have [Node.js](https://nodejs.org/en/) (which includes npm) installed on your machine.

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/andrewkristofer/culinary-compass.git
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd culinary-compass
    ```
3.  **Install NPM packages:**
    ```sh
    npm install
    ```
4.  **Run the development server:**
    ```sh
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or another port if 5173 is busy).

-----

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

-----