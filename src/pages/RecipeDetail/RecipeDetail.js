import React, { useState, useEffect } from 'react';
import './RecipeDetail.css';

const RecipeDetailPage = () => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  // Mock recipe data - replace with API call based on route params
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setRecipe({
        id: 1,
        title: 'Classic Leche Flan',
        image: '/imgs/leche-flan.jpg',
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
      });

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

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      const comment = {
        id: Date.now(),
        user: 'You',
        date: new Date().toLocaleDateString(),
        comment: newComment
      };
      setComments([comment, ...comments]);
      setNewComment('');
      alert('Comment added successfully!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🍰</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Recipe not found</h2>
          <p className="text-gray-600 mb-4">The recipe you're looking for doesn't exist.</p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Recipe Header */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="relative">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-96 object-cover"
            />
            <div className="absolute top-4 right-4 flex gap-2">
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{recipe.title}</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ingredients */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Ingredients</h2>
              <ul className="space-y-3">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-pink-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-700">{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Instructions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Instructions</h2>
              <div className="space-y-6">
                {recipe.instructions.map((instruction, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <span className="flex items-center justify-center w-8 h-8 bg-pink-500 text-white rounded-full font-bold text-sm">
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700 leading-relaxed">{instruction}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
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
                  <p className="text-gray-500 text-center py-8">No comments yet. Be the first to share your thoughts!</p>
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

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }
          
          body {
            background: white !important;
          }
          
          .bg-gray-50 {
            background: white !important;
          }
          
          .shadow-sm {
            box-shadow: none !important;
          }
          
          .rounded-lg {
            border-radius: 0 !important;
          }
          
          .sticky {
            position: static !important;
          }
        }
      `}</style>
    </div>
  );
};

export default RecipeDetailPage;