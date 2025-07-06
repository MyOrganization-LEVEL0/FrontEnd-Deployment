import React, { useState, useEffect } from 'react';
import { recipeService } from '../../services/recipeService';

function EnhancedRecipeForm({ recipe = null, isEditing = false, onSubmit, onCancel }) {
  const [imageName, setImageName] = useState('');
  const [ingredientInput, setIngredientInput] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [instructionInput, setInstructionInput] = useState('');
  const [instructions, setInstructions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    prep_time: '',
    cook_time: '',
    servings: '',
    image: null
  });

  // Categories that match your existing system
  const categories = [
    { value: 'cakes', label: 'Cakes' },
    { value: 'leche-flan', label: 'Leche Flan' },
    { value: 'ube-desserts', label: 'Ube Desserts' },
    { value: 'coconut-desserts', label: 'Coconut Desserts' },
    { value: 'rice-desserts', label: 'Rice Desserts' },
    { value: 'bibingka', label: 'Bibingka' },
    { value: 'traditional-sweets', label: 'Traditional Sweets' },
    { value: 'frozen-treats', label: 'Frozen Treats' },
  ];

  // Initialize form with existing recipe data when editing
  useEffect(() => {
    if (isEditing && recipe) {
      setFormData({
        title: recipe.title || '',
        description: recipe.description || '',
        category: recipe.category || '',
        prep_time: recipe.prep_time || '',
        cook_time: recipe.cook_time || '',
        servings: recipe.servings || '',
        image: null // Keep existing image unless user uploads new one
      });

      // Set ingredients with proper format
      if (recipe.ingredients) {
        let ingredientsToProcess = recipe.ingredients;
        
        // Handle if ingredients is a string (JSON)
        if (typeof recipe.ingredients === 'string') {
          try {
            ingredientsToProcess = JSON.parse(recipe.ingredients);
          } catch (e) {
            ingredientsToProcess = [recipe.ingredients];
          }
        }
        
        if (Array.isArray(ingredientsToProcess)) {
          const formattedIngredients = ingredientsToProcess.map((ingredient) => ({
            name: typeof ingredient === 'string' ? ingredient : ingredient.name || ingredient,
            checked: true
          }));
          setIngredients(formattedIngredients);
        } else {
          setIngredients([]);
        }
      } else {
        setIngredients([]);
      }

      // Set instructions with proper format
      if (recipe.instructions) {
        let instructionsToProcess = recipe.instructions;
        
        // Handle if instructions is a string (JSON)
        if (typeof recipe.instructions === 'string') {
          try {
            instructionsToProcess = JSON.parse(recipe.instructions);
          } catch (e) {
            instructionsToProcess = [recipe.instructions];
          }
        }
        
        if (Array.isArray(instructionsToProcess)) {
          const formattedInstructions = instructionsToProcess.map((instruction) => ({
            text: typeof instruction === 'string' ? instruction : instruction.text || instruction,
            checked: true
          }));
          setInstructions(formattedInstructions);
        } else {
          setInstructions([]);
        }
      } else {
        setInstructions([]);
      }
    }
  }, [isEditing, recipe]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageName(file.name);
      setFormData(prev => ({
        ...prev,
        image: file
      }));
    } else {
      setImageName('');
      setFormData(prev => ({
        ...prev,
        image: null
      }));
    }
  };

  const handleAddIngredient = () => {
    if (ingredientInput.trim() !== '') {
      setIngredients([...ingredients, { name: ingredientInput.trim(), checked: true }]);
      setIngredientInput('');
    }
  };

  const handleKeyPressIngredient = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddIngredient();
    }
  };

  const toggleIngredient = (index) => {
    const updated = [...ingredients];
    updated[index].checked = !updated[index].checked;
    setIngredients(updated);
  };

  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleAddInstruction = () => {
    if (instructionInput.trim() !== '') {
      setInstructions([...instructions, { text: instructionInput.trim(), checked: true }]);
      setInstructionInput('');
    }
  };

  const handleKeyPressInstruction = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddInstruction();
    }
  };

  const toggleInstruction = (index) => {
    const updated = [...instructions];
    updated[index].checked = !updated[index].checked;
    setInstructions(updated);
  };

  const removeInstruction = (index) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      alert('Please enter a recipe title');
      return;
    }
    
    if (ingredients.length === 0) {
      alert('Please add at least one ingredient');
      return;
    }
    
    if (instructions.length === 0) {
      alert('Please add at least one instruction');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Prepare form data for submission
      const submitData = new FormData();
      
      // Basic fields
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('category', formData.category);
      submitData.append('prep_time', parseInt(formData.prep_time) || 0);
      submitData.append('cook_time', parseInt(formData.cook_time) || 0);
      submitData.append('servings', parseInt(formData.servings) || 1);
      
      // Ingredients and instructions as JSON
      const ingredientsList = ingredients.map(ingredient => ingredient.name);
      const instructionsList = instructions.map(instruction => instruction.text);
      
      submitData.append('ingredients', JSON.stringify(ingredientsList));
      submitData.append('instructions', JSON.stringify(instructionsList));
      
      // Image (only if new image is selected)
      if (formData.image) {
        submitData.append('featured_image', formData.image);
      }

      let response;
      if (isEditing) {
        // Update existing recipe
        response = await recipeService.updateRecipe(recipe.id, submitData);
      } else {
        // Create new recipe
        response = await recipeService.createRecipe(submitData);
      }
      
      // Transform response for the parent component
      const recipeData = response.recipe || response;
      const transformedRecipe = {
        id: recipeData.id,
        title: recipeData.title,
        description: recipeData.description,
        ingredients: ingredientsList,
        instructions: instructionsList,
        category: recipeData.category,
        prep_time: recipeData.prep_time,
        cook_time: recipeData.cook_time,
        servings: recipeData.servings,
        status: recipeData.status || 'pending',
        views: recipeData.views_count || 0,
        rating: recipeData.average_rating || 0,
        createdAt: new Date(recipeData.created_at || Date.now()).toLocaleDateString(),
        image: recipeData.featured_image || 'https://via.placeholder.com/300x200?text=No+Image'
      };
      
      onSubmit(transformedRecipe);
      
    } catch (error) {
      console.error('Error submitting recipe:', error);
      
      if (error.response?.data?.details) {
        // Handle validation errors from backend
        const errorMessages = Object.entries(error.response.data.details)
          .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
          .join('\n');
        alert(`Please fix the following errors:\n\n${errorMessages}`);
      } else if (error.response?.data?.error) {
        alert(`Error: ${error.response.data.error}`);
      } else {
        alert('Failed to save recipe. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">
              {isEditing ? `Edit Recipe: ${recipe?.title}` : 'Add New Recipe'}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Recipe Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  placeholder="Enter recipe title"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows="3"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  placeholder="Brief description of your recipe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Servings</label>
                <input
                  type="number"
                  name="servings"
                  value={formData.servings}
                  onChange={handleFormChange}
                  min="1"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  placeholder="Number of servings"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prep Time (minutes)</label>
                <input
                  type="number"
                  name="prep_time"
                  value={formData.prep_time}
                  onChange={handleFormChange}
                  min="0"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  placeholder="Preparation time"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cook Time (minutes)</label>
                <input
                  type="number"
                  name="cook_time"
                  value={formData.cook_time}
                  onChange={handleFormChange}
                  min="0"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  placeholder="Cooking time"
                />
              </div>
            </div>

            {/* Add Ingredients Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Add Ingredients *</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={ingredientInput}
                  onChange={(e) => setIngredientInput(e.target.value)}
                  onKeyPress={handleKeyPressIngredient}
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  placeholder="Enter an ingredient (e.g., 2 cups flour)"
                />
                <button
                  type="button"
                  onClick={handleAddIngredient}
                  className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Ingredients List */}
            {ingredients.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recipe Ingredients</label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <input
                        type="checkbox"
                        checked={ingredient.checked}
                        onChange={() => toggleIngredient(index)}
                        className="accent-purple-500"
                      />
                      <span className={`flex-1 ${ingredient.checked ? 'text-gray-700' : 'text-gray-400 line-through'}`}>
                        {ingredient.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeIngredient(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add Instructions Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Add Instructions *</label>
              <div className="flex gap-2">
                <textarea
                  value={instructionInput}
                  onChange={(e) => setInstructionInput(e.target.value)}
                  onKeyPress={handleKeyPressInstruction}
                  rows="2"
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  placeholder="Enter a step (e.g., Mix flour and sugar in a bowl)"
                />
                <button
                  type="button"
                  onClick={handleAddInstruction}
                  className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Instructions List */}
            {instructions.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recipe Instructions</label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {instructions.map((instruction, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <input
                        type="checkbox"
                        checked={instruction.checked}
                        onChange={() => toggleInstruction(index)}
                        className="accent-purple-500 mt-1"
                      />
                      <span className={`flex-1 ${instruction.checked ? 'text-gray-700' : 'text-gray-400 line-through'}`}>
                        <span className="font-medium text-purple-600">Step {index + 1}:</span> {instruction.text}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeInstruction(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipe Image {isEditing && recipe?.image && '(Upload new image to replace current)'}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200"
              />
              {imageName && (
                <p className="mt-2 text-sm text-gray-600">Selected file: {imageName}</p>
              )}
              {isEditing && recipe?.image && !imageName && (
                <p className="mt-2 text-sm text-gray-500">Current image will be kept if no new image is selected</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-purple-500 text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:bg-purple-600 transition transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting 
                  ? (isEditing ? 'Updating Recipe...' : 'Creating Recipe...') 
                  : (isEditing ? 'Update Recipe' : 'Create Recipe')
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EnhancedRecipeForm;