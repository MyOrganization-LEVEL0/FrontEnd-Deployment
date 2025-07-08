// src/pages/RecipeDetail/RecipeDetail.js
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { recipeService } from '../../services/recipeService';
import { useAuth } from '../../contexts/AuthContext';
import ReportModal from '../../components/ReportModal/ReportModal';
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
  
  // Report modal states
  const [reportModal, setReportModal] = useState({
    isOpen: false,
    contentType: null,
    contentId: null,
    contentTitle: ''
  });

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
            userId: comment.user?.id,
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

  // FIXED: Real favorite functionality
  const handleFavorite = async () => {
    if (!user) {
      alert('Please log in to add favorites');
      return;
    }

    try {
      if (isFavorited) {
        // Remove from favorites
        await recipeService.removeFromFavorites(id);
        setIsFavorited(false);
        alert('Removed from favorites');
      } else {
        // Add to favorites
        await recipeService.addToFavorites(id);
        setIsFavorited(true);
        alert('Added to favorites!');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert(error.message || 'Failed to update favorites. Please try again.');
    }
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
        userId: user?.id,
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
        userId: user?.id,
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

  // Report handling functions
  const openReportModal = (contentType, contentId, contentTitle = '') => {
    if (!user) {
      alert('Please log in to report content');
      return;
    }
    
    setReportModal({
      isOpen: true,
      contentType,
      contentId,
      contentTitle
    });
  };

  const closeReportModal = () => {
    setReportModal({
      isOpen: false,
      contentType: null,
      contentId: null,
      contentTitle: ''
    });
  };

  const handleReportSubmit = async (reportData) => {
    try {
      await recipeService.submitReport(reportData);
      alert('Report submitted successfully. Our moderation team will review it shortly.');
    } catch (error) {
      console.error('Report submission error:', error); // Debug logging
      
      // Handle duplicate report case more gracefully
      if (error.message.includes('already reported')) {
        alert('You\'ve already reported this content.');
        // Don't re-throw for duplicate reports - this is handled successfully
        return;
      } else {
        // More detailed error message for debugging
        const errorMsg = error.message || 'Failed to submit report. Please try again.';
        alert(`Error: ${errorMsg}`);
        console.error('Full error details:', error);
        throw error; // Only re-throw for actual errors
      }
    }
  };

  const canCurrentUserReport = (contentUserId) => {
    // Users shouldn't report their own content
    return user && user.id !== contentUserId;
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
                    ? 'bg-pink-500 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </button>
              
              <button
                onClick={handlePrint}
                className="p-3 bg-white text-gray-700 rounded-full shadow-lg hover:bg-gray-50 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
              </button>

              {/* Report Recipe Button - Always show if user is logged in */}
              {user && (
                <button
                  onClick={() => openReportModal('recipe', recipe.id, recipe.title)}
                  className="p-3 bg-white text-red-600 rounded-full shadow-lg hover:bg-red-50 transition"
                  title="Report this recipe"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div className="p-6">
            <div className="flex flex-wrap items-center justify-between mb-4">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 print-title">
                {recipe.title}
              </h1>
              
              <div className="flex items-center gap-4 text-sm text-gray-600 no-print">
                <span>{recipe.views_count} views</span>
              </div>
            </div>

            <p className="text-gray-600 mb-6 print-description">{recipe.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center print-recipe-info">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-pink-500">{recipe.prep_time}</div>
                <div className="text-sm text-gray-600">Prep Time</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-pink-500">{recipe.cook_time}</div>
                <div className="text-sm text-gray-600">Cook Time</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-pink-500">{recipe.total_time}</div>
                <div className="text-sm text-gray-600">Total Time</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-pink-500">{recipe.servings}</div>
                <div className="text-sm text-gray-600">Servings</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recipe Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Ingredients */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 print-ingredients">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Ingredients</h2>
              {recipe.ingredients && recipe.ingredients.length > 0 ? (
                <ul className="space-y-3 print-ingredients-list">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start print-ingredient-item">
                      <label className="flex items-start cursor-pointer w-full no-print">
                        <input
                          type="checkbox"
                          checked={checkedIngredients[index] || false}
                          onChange={() => handleIngredientCheck(index)}
                          className="mt-1 mr-3 accent-pink-500"
                        />
                        <span className={`text-gray-700 leading-relaxed ${checkedIngredients[index] ? 'line-through text-gray-500' : ''}`}>
                          {ingredient}
                        </span>
                      </label>
                      <span className="text-gray-700 leading-relaxed print-only">{ingredient}</span>
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
            <div className="bg-white rounded-lg shadow-sm p-6 print-instructions">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Instructions</h2>
              {recipe.instructions && recipe.instructions.length > 0 ? (
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
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 no-print mt-8">
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
                <div key={comment.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {comment.user.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{comment.user}</p>
                        <p className="text-sm text-gray-500">{comment.date}</p>
                      </div>
                    </div>
                    
                    {/* Report Comment Button */}
                    {canCurrentUserReport(comment.userId) && (
                      <button
                        onClick={() => openReportModal('comment', comment.id, `Comment by ${comment.user}`)}
                        className="text-red-500 hover:text-red-700 text-sm px-2 py-1 rounded hover:bg-red-50 transition"
                        title="Report this comment"
                      >
                        🚩 Report
                      </button>
                    )}
                  </div>
                  <p className="text-gray-700 leading-relaxed ml-11">{comment.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Report Modal */}
      <ReportModal
        isOpen={reportModal.isOpen}
        onClose={closeReportModal}
        contentType={reportModal.contentType}
        contentId={reportModal.contentId}
        contentTitle={reportModal.contentTitle}
        onSubmit={handleReportSubmit}
      />
    </div>
  );
};

export default RecipeDetailPage;