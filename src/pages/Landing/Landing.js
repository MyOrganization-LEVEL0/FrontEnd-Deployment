// src/pages/Landing/Landing.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { recipeService } from '../../services/recipeService';
import RecipeCard from '../../components/cards/RecipeCard';
import ContactForm from '../../components/forms/ContactForm';

const Landing = () => {
  const [featuredRecipes, setFeaturedRecipes] = useState([
    // Default static recipes that will be replaced by API data
    {
      color: "pink",
      title: "Strawberry Shortcake",
      description: "A classic dessert with layers of sweet cake, fresh strawberries, and whipped cream.",
      time: "30 minutes"
    },
    {
      color: "yellow",
      title: "Lemon Cheesecake",
      description: "Creamy cheesecake with a bright lemon flavor and graham cracker crust.",
      time: "1 hour"
    },
    {
      color: "green",
      title: "Mint Chocolate Cookies",
      description: "Rich chocolate cookies with refreshing mint chips, perfect for any occasion.",
      time: "45 minutes"
    }
  ]);

  // Fetch real recipes to replace static ones
  useEffect(() => {
    const fetchFeaturedRecipes = async () => {
      try {
        // Try to get featured recipes first
        const params = {
          featured: 'true',
          page_size: 3,
        };

        const response = await recipeService.getAllRecipes(params);
        
        // Filter only published recipes
        let publishedRecipes = (response.results || []).filter(recipe => 
          recipe.status === 'published'
        );

        // If we don't have enough featured recipes, get latest published ones
        if (publishedRecipes.length < 3) {
          try {
            const allRecipesResponse = await recipeService.getAllRecipes({
              page_size: 6,
            });
            publishedRecipes = (allRecipesResponse.results || []).filter(recipe => 
              recipe.status === 'published'
            ).slice(0, 3);
          } catch (err) {
            // Keep static recipes if API fails
            return;
          }
        }

        // Transform API recipes to match RecipeCard props
        if (publishedRecipes.length > 0) {
          const colors = ['pink', 'yellow', 'green'];
          const transformedRecipes = publishedRecipes.slice(0, 3).map((recipe, index) => ({
            id: recipe.id, // Add ID for potential navigation
            color: colors[index],
            title: recipe.title,
            description: recipe.description || getDefaultDescription(recipe.category),
            time: recipe.prep_time ? `${recipe.prep_time} minutes` : '30 minutes',
            image: recipe.featured_image // Add image URL
          }));

          setFeaturedRecipes(transformedRecipes);
        }

      } catch (error) {
        console.error('Error fetching featured recipes:', error);
        // Keep static recipes if API fails - no error shown to user
      }
    };

    fetchFeaturedRecipes();
  }, []);

  // Helper function to get default descriptions based on category
  const getDefaultDescription = (category) => {
    const descriptions = {
      'cakes': 'Delicious homemade cake perfect for any celebration',
      'cookies': 'Sweet and crunchy cookies that everyone will love',
      'pastries': 'Flaky, buttery pastries made with love',
      'candy': 'Sweet treats to satisfy your sugar cravings',
      'custard': 'Creamy, smooth custard dessert',
      'fried_desserts': 'Crispy fried dessert with amazing flavors',
      'frozen_desserts': 'Cool and refreshing frozen treat',
      'gelatin_desserts': 'Light and jiggly gelatin-based dessert',
      'fruit_desserts': 'Fresh fruit dessert bursting with flavor',
      'pies': 'Classic pie with perfect crust and filling'
    };
    return descriptions[category] || 'A delicious homemade dessert recipe';
  };

  return (
    <>
      {/* Hero Section */}
      <section className="pastel-gradient py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
            Discover Delicious Homemade Desserts
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8">
            Explore our collection of easy-to-follow recipes for cakes, cookies, pastries, and more!
          </p>
          <Link to="/recipes" className="bg-white text-pink-500 font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 inline-block">
            Browse Recipes
          </Link>
        </div>
      </section>

      {/* Top Recipes Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Featured Recipes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRecipes.map((recipe, index) => (
              <RecipeCard
                key={recipe.id || index}
                color={recipe.color}
                title={recipe.title}
                description={recipe.description}
                time={recipe.time}
                recipeId={recipe.id} // Pass ID for navigation if it exists
                image={recipe.image} // Pass image URL
              />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/categories" className="bg-blue-100 text-blue-500 font-semibold px-6 py-3 rounded-full hover:bg-blue-200 transition inline-block">
              See Categories
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 pastel-gradient">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Contact Us</h2>
            <p className="text-center text-gray-600 mb-8">
              Have questions or suggestions? We'd love to hear from you!
            </p>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
};

export default Landing;