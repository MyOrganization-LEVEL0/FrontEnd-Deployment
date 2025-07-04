// src/pages/RecipeDetail/RecipeDetail.js
import React, { useState, useEffect } from 'react';
import './RecipeDetail.css';

const RecipeDetailPage = () => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [checkedIngredients, setCheckedIngredients] = useState([]);

  // Mock recipe data - replace with API call based on route params
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const recipeData = {
        id: 1,
        title: 'Classic Leche Flan',
        image: '/imgs/leche-flan.jpg',
        prep_time: '30 minutes',
        cook_time: '50 minutes',
        servings: '8 servings',
        ingredients: [
          '1 cup granulated sugar (for caramel)',
          '1/4 cup water',
          '10 large egg yolks',
          '1 can (14 oz) sweetened condensed milk',
          '1 can (12 oz) evaporated milk',
          '1 tsp vanilla extract (optional)'
        ],
        instructions: [
          'In a saucepan, combine 1 cup sugar and 1/4 cup water. Cook over medium heat without stirring until sugar dissolves and turns golden amber (about 10 minutes).',
          'Quickly pour the hot caramel into your llanera or baking dish, tilting to coat the bottom evenly. Set aside to cool and harden.',
          'In a large bowl, gently whisk egg yolks. Add condensed milk, evaporated milk, and vanilla. Mix until smooth but avoid creating bubbles.',
          'Strain the mixture to remove any lumps, then pour over the hardened caramel.',
          'Cover tightly with aluminum foil. Steam for 40-50 minutes or until a toothpick inserted comes out clean.',
          'Let flan cool completely, then refrigerate for at least 4 hours or overnight.',
          'To unmold, run a knife around the edges and quickly invert onto serving plate.'
        ]
      };
      
      setRecipe(recipeData);
      
      // Initialize ingredient checkboxes AFTER recipe is set
      setCheckedIngredients(new Array(recipeData.ingredients.length).fill(false));

      setComments([
        {
          id: 1,
          user: 'Maria Santos',
          date: '2024-02-15',
          comment: 'Perfect recipe! My family loved it. The instructions were clear and easy to follow.'
        },
        {
          id: 2,
          user: 'Juan Dela Cruz',
          date: '2024-02-10',
          comment: 'Great flan! I added a bit more vanilla and it was delicious. Will definitely make again.'
        },
        {
          id: 3,
          user: 'Ana Reyes',
          date: '2024-02-08',
          comment: 'This is exactly like my lola\'s recipe! Brought back so many memories. Thank you for sharing.'
        }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    // Add API call to save/remove favorite
    alert(isFavorited ? 'Removed from favorites' : 'Added to favorites!');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      const comment = {
        id: comments.length + 1,
        user: 'Current User',
        date: new Date().toLocaleDateString(),
        comment: newComment
      };
      setComments([...comments, comment]);
      setNewComment('');
    }
  };

  const handleIngredientCheck = (index) => {
    const newChecked = [...checkedIngredients];
    newChecked[index] = !newChecked[index];
    setCheckedIngredients(newChecked);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Recipe Not Found</h2>
          <p className="text-gray-600">The recipe you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recipe-detail-container bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Recipe Header */}
        <div className="bg-white rounded-lg shadow-sm mb-8 overflow-hidden">
          <div className="relative">
            <img 
              src={recipe.image} 
              alt={recipe.title}
              className="w-full h-64 md:h-80 object-cover"
            />
            
            {/* Action Buttons - Hidden in print */}
            <div className="absolute top-4 right-4 flex gap-2 no-print">
              <button
                onClick={handleFavorite}
                className={`p-3 rounded-full shadow-lg transition ${
                  isFavorited 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white text-gray-600 hover:text-red-500'
                }`}
              >
                <svg className="w-6 h-6" fill={isFavorited ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
              
              <button
                onClick={handlePrint}
                className="p-3 bg-white text-gray-600 rounded-full shadow-lg hover:text-gray-800 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 print-title">
              {recipe.title}
            </h1>
            
            {/* Recipe Meta Info - Print friendly */}
            <div className="print-meta mb-6 text-sm text-gray-600">
              <p>Prep Time: {recipe.prep_time} | Cook Time: {recipe.cook_time} | Servings: {recipe.servings}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ingredients - Print optimized */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 print-ingredients">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 print-section-title">
                Ingredients
              </h2>
              <ul className="space-y-3 print-ingredients-list">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start">
                    {/* Checkbox for interactive use - hidden in print */}
                    <div className="no-print mr-3 mt-1">
                      <input
                        type="checkbox"
                        id={`ingredient-${index}`}
                        checked={checkedIngredients[index]}
                        onChange={() => handleIngredientCheck(index)}
                        className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500 focus:ring-2"
                      />
                    </div>
                    
                    {/* Print bullet point - only shown in print */}
                    <span className="print-only inline-block w-2 h-2 bg-pink-500 rounded-full mt-2 mr-3 flex-shrink-0 print-bullet"></span>
                    
                    <label 
                      htmlFor={`ingredient-${index}`}
                      className={`text-gray-700 print-ingredient-text cursor-pointer select-none transition-all ${
                        checkedIngredients[index] 
                          ? 'line-through text-gray-400' 
                          : 'text-gray-700'
                      }`}
                    >
                      {ingredient}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Instructions - Print optimized */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8 print-instructions">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 print-section-title">
                Instructions
              </h2>
              <div className="space-y-6 print-instructions-list">
                {recipe.instructions.map((instruction, index) => (
                  <div key={index} className="flex gap-4 print-instruction-item">
                    <div className="flex-shrink-0">
                      <span className="flex items-center justify-center w-8 h-8 bg-pink-500 text-white rounded-full font-bold text-sm print-step-number">
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700 leading-relaxed print-instruction-text">
                        {instruction}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Comments Section - Hidden in print */}
            <div className="bg-white rounded-lg shadow-sm p-6 no-print">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Comments</h2>
              
              {/* Add Comment Form */}
              <div className="mb-8">
                <div className="space-y-4">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts about this recipe..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleCommentSubmit}
                    className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
                  >
                    Add Comment
                  </button>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-6">
                {comments.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No comments yet. Be the first to share your thoughts!
                  </p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                          <span className="text-pink-600 font-semibold text-sm">
                            {comment.user.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{comment.user}</p>
                          <p className="text-sm text-gray-500">{comment.date}</p>
                        </div>
                      </div>
                      <p className="text-gray-700 ml-13">{comment.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Print Styles */}
      <style jsx>{`
        @media print {
          /* Print bullet point - only visible in print */
          .print-only {
            display: none !important;
          }
          
          /* Show print elements only when printing */
          @media print {
            .print-only {
              display: inline-block !important;
            }
          }
          
          /* Hide everything except recipe content */
          body * {
            visibility: hidden;
          }
          
          /* Show only recipe content */
          .recipe-detail-container,
          .recipe-detail-container * {
            visibility: visible;
          }
          
          /* Hide specific non-recipe elements */
          .no-print,
          .no-print * {
            display: none !important;
            visibility: hidden !important;
          }
          
          /* Reset print layout */
          body {
            background: white !important;
            font-size: 12pt;
            line-height: 1.4;
            color: black !important;
          }
          
          .recipe-detail-container {
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          
          .container {
            max-width: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          
          /* Recipe title */
          .print-title {
            font-size: 24pt !important;
            font-weight: bold !important;
            margin-bottom: 16pt !important;
            color: black !important;
            text-align: center !important;
          }
          
          /* Recipe meta info */
          .print-meta {
            text-align: center !important;
            margin-bottom: 20pt !important;
            font-size: 10pt !important;
            color: #666 !important;
          }
          
          /* Section titles */
          .print-section-title {
            font-size: 16pt !important;
            font-weight: bold !important;
            margin-bottom: 12pt !important;
            color: black !important;
            border-bottom: 1pt solid #ccc !important;
            padding-bottom: 4pt !important;
          }
          
          /* Ingredients section */
          .print-ingredients {
            background: white !important;
            box-shadow: none !important;
            border: none !important;
            margin-bottom: 20pt !important;
            page-break-inside: avoid;
          }
          
          .print-ingredients-list {
            margin: 0 !important;
            padding: 0 !important;
          }
          
          .print-ingredient-text {
            font-size: 10pt !important;
            color: black !important;
            line-height: 1.4 !important;
            text-decoration: none !important;
          }
          
          .print-bullet {
            background: black !important;
            width: 4pt !important;
            height: 4pt !important;
          }
          
          /* Instructions section */
          .print-instructions {
            background: white !important;
            box-shadow: none !important;
            border: none !important;
            margin-bottom: 20pt !important;
          }
          
          .print-instructions-list {
            margin: 0 !important;
            padding: 0 !important;
          }
          
          .print-instruction-item {
            margin-bottom: 12pt !important;
            page-break-inside: avoid;
          }
          
          .print-step-number {
            background: black !important;
            color: white !important;
            width: 20pt !important;
            height: 20pt !important;
            font-size: 10pt !important;
            font-weight: bold !important;
          }
          
          .print-instruction-text {
            font-size: 10pt !important;
            color: black !important;
            line-height: 1.4 !important;
          }
          
          /* Remove all shadows, borders, and colors */
          .shadow-sm,
          .shadow-md,
          .shadow-lg,
          .rounded-lg,
          .bg-white,
          .bg-gray-50,
          .bg-pink-500 {
            box-shadow: none !important;
            border-radius: 0 !important;
            background: white !important;
          }
          
          /* Remove grid layout for better print flow */
          .grid,
          .lg\\:grid-cols-3,
          .lg\\:col-span-1,
          .lg\\:col-span-2 {
            display: block !important;
            grid-template-columns: none !important;
            column-span: none !important;
          }
          
          /* Ensure proper page breaks */
          .print-ingredients {
            page-break-after: avoid;
          }
          
          .print-instructions {
            page-break-before: avoid;
          }
          
          /* Hide recipe image in print to save space */
          img {
            display: none !important;
          }
          
          /* If you want to keep the image, uncomment this instead:
          img {
            max-width: 100% !important;
            height: auto !important;
            margin: 0 auto 20pt auto !important;
            display: block !important;
          }
          */
        }
      `}</style>
    </div>
  );
};

export default RecipeDetailPage;