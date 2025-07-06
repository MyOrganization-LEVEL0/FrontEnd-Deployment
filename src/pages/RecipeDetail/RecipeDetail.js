// src/pages/RecipeDetail/RecipeDetail.js
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { recipeService } from '../../services/recipeService';
import { useAuth } from '../../contexts/AuthContext';
import './RecipeDetail.css';

const RecipeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [checkedIngredients, setCheckedIngredients] = useState([]);

  useEffect(() => {
    let cancelled = false;
    
    const fetchRecipeData = async () => {
      if (!id) {
        setError('Recipe ID not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch recipe details
        const recipeData = await recipeService.getRecipeById(id);
        
        // Only update state if effect hasn't been cancelled
        if (cancelled) return;
        
        // Transform API data
        const transformedRecipe = {
          id: recipeData.id,
          title: recipeData.title,
          description: recipeData.description,
          image: recipeData.featured_image || '/imgs/placeholder-recipe.jpg',
          prep_time: `${recipeData.prep_time} minutes`,
          cook_time: `${recipeData.cook_time} minutes`,
          total_time: `${(recipeData.prep_time || 0) + (recipeData.cook_time || 0)} minutes`,
          servings: recipeData.servings,
          ingredients: Array.isArray(recipeData.ingredients) ? recipeData.ingredients : [],
          instructions: Array.isArray(recipeData.instructions) ? recipeData.instructions : [],
          category: recipeData.category,
          category_display: recipeData.category_display,
          author: recipeData.author,
          views_count: recipeData.views_count || 0,
          likes_count: recipeData.likes_count || 0,
          average_rating: recipeData.average_rating || 0,
          created_at: recipeData.created_at,
          is_favorited: recipeData.is_favorited || false,
          can_edit: recipeData.can_edit || false
        };

        setRecipe(transformedRecipe);
        setIsFavorited(transformedRecipe.is_favorited);
        
        // Initialize ingredient checkboxes
        if (transformedRecipe.ingredients.length > 0) {
          setCheckedIngredients(new Array(transformedRecipe.ingredients.length).fill(false));
        }

        // Load comments
        try {
          const commentsData = await recipeService.getComments(id);
          const transformedComments = commentsData.map(comment => ({
            id: comment.id,
            user: comment.user ? `${comment.user.first_name} ${comment.user.last_name}` : 'Anonymous',
            date: new Date(comment.created_at).toLocaleDateString(),
            comment: comment.content
          }));
          if (!cancelled) {
            setComments(transformedComments);
          }
        } catch (commentsError) {
          console.error('Error loading comments:', commentsError);
          if (!cancelled) {
            setComments([]);
          }
        }

      } catch (error) {
        console.error('Error loading recipe:', error);
        if (error.response?.status === 404) {
          setError('Recipe not found');
        } else {
          setError('Failed to load recipe. Please try again.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchRecipeData();
    
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    alert(isFavorited ? 'Removed from favorites' : 'Added to favorites!');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    
    if (!user) {
      alert('Please log in to add comments');
      return;
    }

    try {
      const commentData = await recipeService.addComment(id, {
        content: newComment.trim()
      });
      
      const transformedComment = {
        id: commentData.id,
        user: user ? `${user.first_name} ${user.last_name}` : 'Current User',
        date: new Date().toLocaleDateString(),
        comment: newComment.trim()
      };
      
      setComments([...comments, transformedComment]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
      const fallbackComment = {
        id: comments.length + 1,
        user: user ? `${user.first_name} ${user.last_name}` : 'Current User',
        date: new Date().toLocaleDateString(),
        comment: newComment.trim()
      };
      setComments([...comments, fallbackComment]);
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
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700"
          >
            Go Back
          </button>
        </div>
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
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-pink-600 hover:text-pink-700 no-print"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* Recipe Header */}
        <div className="bg-white rounded-lg shadow-sm mb-8 overflow-hidden">
          <div className="relative">
            <img 
              src={recipe.image} 
              alt={recipe.title}
              className="w-full h-64 md:h-80 object-cover"
              onError={(e) => {
                e.target.src = '/imgs/placeholder-recipe.jpg';
              }}
            />
            
            {/* Action Buttons */}
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
            
            {recipe.description && (
              <p className="text-gray-600 mb-4">{recipe.description}</p>
            )}

            <div className="print-meta mb-6 text-sm text-gray-600">
              <p>Prep Time: {recipe.prep_time} | Cook Time: {recipe.cook_time} | Servings: {recipe.servings}</p>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500 no-print">
              <span>👁️ {recipe.views_count} views</span>
              <span>❤️ {recipe.likes_count} likes</span>
              <span>⭐ {recipe.average_rating > 0 ? recipe.average_rating.toFixed(1) : 'No ratings'}</span>
              {recipe.author && (
                <>
                  <span>•</span>
                  <span>By {recipe.author.first_name} {recipe.author.last_name}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ingredients */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 print-ingredients">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 print-section-title">
                Ingredients
              </h2>
              
              {recipe.ingredients.length > 0 ? (
                <ul className="space-y-3 print-ingredients-list">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start">
                      <div className="no-print mr-3 mt-1">
                        <input
                          type="checkbox"
                          id={`ingredient-${index}`}
                          checked={checkedIngredients[index]}
                          onChange={() => handleIngredientCheck(index)}
                          className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500 focus:ring-2"
                        />
                      </div>
                      
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
              ) : (
                <p className="text-gray-500">No ingredients listed</p>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8 print-instructions">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 print-section-title">
                Instructions
              </h2>
              
              {recipe.instructions.length > 0 ? (
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
              ) : (
                <p className="text-gray-500">No instructions provided</p>
              )}
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-lg shadow-sm p-6 no-print">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Comments ({comments.length})</h2>
              
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
    </div>
  );
};

export default RecipeDetailPage;