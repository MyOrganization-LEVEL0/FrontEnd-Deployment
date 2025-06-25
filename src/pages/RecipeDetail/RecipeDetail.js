// src/pages/RecipeDetail/RecipeDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './RecipeDetail.css';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ingredients');
  const [servings, setServings] = useState(4);
  const [checkedIngredients, setCheckedIngredients] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  // Mock data - replace with API call
  const recipe = {
    id: 1,
    title: 'Classic Filipino Leche Flan',
    description: 'A creamy and smooth Filipino custard dessert made with eggs and milk, topped with soft caramel.',
    category: 'Custard',
    author: 'Maria Santos',
    authorId: 1,
    prepTime: 20,
    cookTime: 60,
    totalTime: 80,
    servings: 8,
    difficulty: 'Medium',
    rating: 4.8,
    reviewCount: 156,
    viewCount: 2341,
    images: [
      '/imgs/leche-flan-1.jpg',
      '/imgs/leche-flan-2.jpg',
      '/imgs/leche-flan-3.jpg'
    ],
    ingredients: [
      { id: 1, name: 'Egg yolks', quantity: 12, unit: 'pieces', group: 'For the custard' },
      { id: 2, name: 'Sweetened condensed milk', quantity: 1, unit: 'can (14 oz)', group: 'For the custard' },
      { id: 3, name: 'Evaporated milk', quantity: 1, unit: 'can (12 oz)', group: 'For the custard' },
      { id: 4, name: 'Vanilla extract', quantity: 1, unit: 'teaspoon', group: 'For the custard' },
      { id: 5, name: 'Granulated sugar', quantity: 1, unit: 'cup', group: 'For the caramel' },
      { id: 6, name: 'Water', quantity: 0.25, unit: 'cup', group: 'For the caramel' }
    ],
    steps: [
      {
        id: 1,
        number: 1,
        title: 'Make the caramel',
        instruction: 'In a saucepan, combine sugar and water. Cook over medium heat until sugar melts and turns golden amber. Quickly pour caramel into your llanera (flan mold) and tilt to coat the bottom evenly. Set aside to cool.',
        time: 10,
        image: '/imgs/step-1.jpg'
      },
      {
        id: 2,
        number: 2,
        title: 'Prepare the custard mixture',
        instruction: 'In a large bowl, gently combine egg yolks, condensed milk, evaporated milk, and vanilla extract. Avoid creating too many bubbles. Mix gently until well combined.',
        time: 5,
        tip: 'Use a whisk and mix gently to avoid bubbles for a smoother flan.'
      },
      {
        id: 3,
        number: 3,
        title: 'Strain and pour',
        instruction: 'Strain the mixture through a fine-mesh strainer to remove any bubbles or egg whites. Pour the strained mixture into the prepared llanera with caramel.',
        time: 5
      },
      {
        id: 4,
        number: 4,
        title: 'Steam the flan',
        instruction: 'Cover the llanera tightly with aluminum foil. Steam for 50-60 minutes or until a toothpick inserted comes out clean. Alternatively, bake in a water bath at 350°F for 60 minutes.',
        time: 60
      },
      {
        id: 5,
        number: 5,
        title: 'Cool and unmold',
        instruction: 'Let the flan cool completely. Run a knife around the edges to loosen. Place a plate over the llanera and quickly flip over. The caramel will flow over the flan.',
        time: 5
      }
    ],
    nutrition: {
      calories: 320,
      carbs: 45,
      protein: 8,
      fat: 12,
      sugar: 42
    },
    tags: ['Filipino Dessert', 'Traditional', 'Holidays', 'Make Ahead'],
    tips: [
      'For a smoother texture, strain the mixture twice.',
      'Make sure to cover tightly with foil to prevent water from getting in.',
      'Leche flan can be made 2 days ahead and kept refrigerated.',
      'For individual servings, use small ramekins instead of one large mold.'
    ]
  };

  const handleServingsChange = (newServings) => {
    setServings(newServings);
  };

  const calculateQuantity = (originalQuantity) => {
    return (originalQuantity * servings / recipe.servings).toFixed(2);
  };

  const toggleIngredient = (ingredientId) => {
    setCheckedIngredients(prev =>
      prev.includes(ingredientId)
        ? prev.filter(id => id !== ingredientId)
        : [...prev, ingredientId]
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // TODO: Add API call to save favorite
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: recipe.title,
        text: recipe.description,
        url: window.location.href,
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Recipe link copied to clipboard!');
    }
  };

  return (
    <div className="recipe-detail-container">
      {/* Hero Section */}
      <section className="recipe-hero">
        <div className="container mx-auto px-4">
          <button 
            onClick={() => navigate(-1)}
            className="back-button mb-4 text-gray-600 hover:text-gray-800 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Recipes
          </button>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div className="recipe-images">
              <div className="main-image mb-4">
                <img 
                  src={recipe.images[0]} 
                  alt={recipe.title}
                  className="w-full h-96 object-cover rounded-xl"
                  onError={(e) => {e.target.src = '/imgs/default-recipe.png'}}
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {recipe.images.map((image, index) => (
                  <img 
                    key={index}
                    src={image} 
                    alt={`${recipe.title} ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80"
                    onError={(e) => {e.target.src = '/imgs/default-recipe.png'}}
                  />
                ))}
              </div>
            </div>

            {/* Recipe Info */}
            <div className="recipe-info">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{recipe.title}</h1>
                <div className="flex gap-2">
                  <button 
                    onClick={toggleFavorite}
                    className={`p-2 rounded-full ${isFavorite ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600'} hover:opacity-80`}
                  >
                    <svg className="w-6 h-6" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                  <button 
                    onClick={handleShare}
                    className="p-2 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </button>
                  <button 
                    onClick={handlePrint}
                    className="p-2 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                  </button>
                </div>
              </div>

              <p className="text-gray-600 mb-4">{recipe.description}</p>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <span>By {recipe.author}</span>
                <span>•</span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {recipe.rating} ({recipe.reviewCount} reviews)
                </span>
                <span>•</span>
                <span>{recipe.viewCount} views</span>
              </div>

              <div className="recipe-tags mb-6">
                {recipe.tags.map(tag => (
                  <span key={tag} className="inline-block bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm mr-2 mb-2">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="recipe-meta grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="text-center">
                  <svg className="w-6 h-6 mx-auto mb-1 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs text-gray-500">Prep Time</p>
                  <p className="font-semibold">{recipe.prepTime} min</p>
                </div>
                <div className="text-center">
                  <svg className="w-6 h-6 mx-auto mb-1 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  </svg>
                  <p className="text-xs text-gray-500">Cook Time</p>
                  <p className="font-semibold">{recipe.cookTime} min</p>
                </div>
                <div className="text-center">
                  <svg className="w-6 h-6 mx-auto mb-1 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="text-xs text-gray-500">Servings</p>
                  <p className="font-semibold">{recipe.servings}</p>
                </div>
                <div className="text-center">
                  <svg className="w-6 h-6 mx-auto mb-1 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p className="text-xs text-gray-500">Difficulty</p>
                  <p className="font-semibold">{recipe.difficulty}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recipe Content */}
      <section className="recipe-content py-12">
        <div className="container mx-auto px-4">
          {/* Tabs */}
          <div className="flex border-b mb-8">
            <button
              className={`px-6 py-3 font-medium ${activeTab === 'ingredients' ? 'border-b-2 border-pink-500 text-pink-500' : 'text-gray-600'}`}
              onClick={() => setActiveTab('ingredients')}
            >
              Ingredients
            </button>
            <button
              className={`px-6 py-3 font-medium ${activeTab === 'instructions' ? 'border-b-2 border-pink-500 text-pink-500' : 'text-gray-600'}`}
              onClick={() => setActiveTab('instructions')}
            >
              Instructions
            </button>
            <button
              className={`px-6 py-3 font-medium ${activeTab === 'nutrition' ? 'border-b-2 border-pink-500 text-pink-500' : 'text-gray-600'}`}
              onClick={() => setActiveTab('nutrition')}
            >
              Nutrition
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              {/* Ingredients Tab */}
              {activeTab === 'ingredients' && (
                <div className="ingredients-section">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Ingredients</h2>
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-gray-600">Servings:</label>
                      <button
                        onClick={() => handleServingsChange(Math.max(1, servings - 1))}
                        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span className="font-semibold px-3">{servings}</span>
                      <button
                        onClick={() => handleServingsChange(servings + 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Group ingredients by category */}
                  {Object.entries(
                    recipe.ingredients.reduce((groups, ingredient) => {
                      const group = ingredient.group || 'Main';
                      if (!groups[group]) groups[group] = [];
                      groups[group].push(ingredient);
                      return groups;
                    }, {})
                  ).map(([group, ingredients]) => (
                    <div key={group} className="mb-6">
                      <h3 className="font-semibold text-gray-700 mb-3">{group}</h3>
                      <ul className="space-y-2">
                        {ingredients.map(ingredient => (
                          <li key={ingredient.id} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={checkedIngredients.includes(ingredient.id)}
                              onChange={() => toggleIngredient(ingredient.id)}
                              className="mr-3 h-5 w-5 text-pink-500"
                            />
                            <span className={checkedIngredients.includes(ingredient.id) ? 'line-through text-gray-400' : ''}>
                              {calculateQuantity(ingredient.quantity)} {ingredient.unit} {ingredient.name}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Instructions Tab */}
              {activeTab === 'instructions' && (
                <div className="instructions-section">
                  <h2 className="text-2xl font-bold mb-6">Instructions</h2>
                  <div className="space-y-6">
                    {recipe.steps.map((step, index) => (
                      <div 
                        key={step.id}
                        className={`step-card p-6 rounded-lg border-2 ${currentStep === index ? 'border-pink-500 bg-pink-50' : 'border-gray-200'}`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`step-number flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentStep === index ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                            {step.number}
                          </div>
                          <div className="flex-grow">
                            <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                            <p className="text-gray-700 mb-3">{step.instruction}</p>
                            {step.tip && (
                              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mt-3">
                                <p className="text-sm text-yellow-800">
                                  <strong>Tip:</strong> {step.tip}
                                </p>
                              </div>
                            )}
                            {step.time && (
                              <p className="text-sm text-gray-500 mt-2">
                                <svg className="inline w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {step.time} minutes
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between mt-8">
                    <button
                      onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                      disabled={currentStep === 0}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous Step
                    </button>
                    <button
                      onClick={() => setCurrentStep(Math.min(recipe.steps.length - 1, currentStep + 1))}
                      disabled={currentStep === recipe.steps.length - 1}
                      className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next Step
                    </button>
                  </div>
                </div>
              )}

              {/* Nutrition Tab */}
              {activeTab === 'nutrition' && (
                <div className="nutrition-section">
                  <h2 className="text-2xl font-bold mb-6">Nutrition Information</h2>
                  <p className="text-gray-600 mb-4">Per serving</p>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="nutrition-card bg-blue-50 p-4 rounded-lg text-center">
                      <p className="text-2xl font-bold text-blue-600">{recipe.nutrition.calories}</p>
                      <p className="text-sm text-gray-600">Calories</p>
                    </div>
                    <div className="nutrition-card bg-orange-50 p-4 rounded-lg text-center">
                      <p className="text-2xl font-bold text-orange-600">{recipe.nutrition.carbs}g</p>
                      <p className="text-sm text-gray-600">Carbs</p>
                    </div>
                    <div className="nutrition-card bg-red-50 p-4 rounded-lg text-center">
                      <p className="text-2xl font-bold text-red-600">{recipe.nutrition.protein}g</p>
                      <p className="text-sm text-gray-600">Protein</p>
                    </div>
                    <div className="nutrition-card bg-yellow-50 p-4 rounded-lg text-center">
                      <p className="text-2xl font-bold text-yellow-600">{recipe.nutrition.fat}g</p>
                      <p className="text-sm text-gray-600">Fat</p>
                    </div>
                    <div className="nutrition-card bg-purple-50 p-4 rounded-lg text-center">
                      <p className="text-2xl font-bold text-purple-600">{recipe.nutrition.sugar}g</p>
                      <p className="text-sm text-gray-600">Sugar</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="sidebar">
              {/* Tips Card */}
              <div className="tips-card bg-yellow-50 p-6 rounded-xl mb-6">
                <h3 className="font-bold text-lg mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Pro Tips
                </h3>
                <ul className="space-y-2">
                  {recipe.tips.map((tip, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start">
                      <span className="text-yellow-600 mr-2">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recipe Actions */}
              <div className="actions-card bg-gray-50 p-6 rounded-xl">
                <h3 className="font-bold text-lg mb-4">Recipe Actions</h3>
                <div className="space-y-3">
                  <button className="w-full py-2 px-4 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-left flex items-center">
                    <svg className="w-5 h-5 mr-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Add to Meal Plan
                  </button>
                  <button className="w-full py-2 px-4 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-left flex items-center">
                    <svg className="w-5 h-5 mr-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Copy Ingredients
                  </button>
                  <button className="w-full py-2 px-4 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-left flex items-center">
                    <svg className="w-5 h-5 mr-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Download Recipe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="reviews-section py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Reviews</h2>
          <div className="text-center text-gray-500 py-8">
            <p>Reviews coming soon!</p>
          </div>
        </div>
      </section>

      {/* Related Recipes */}
      <section className="related-recipes py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">More Filipino Desserts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sample related recipes - replace with actual data */}
            {[1, 2, 3].map(i => (
              <div key={i} className="recipe-card bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2">Related Recipe {i}</h3>
                  <p className="text-gray-600 text-sm">Quick description of the recipe</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default RecipeDetail;