import React, { useState } from 'react';
import { recipeService } from '../../services/recipeService'; // Add this line


function EnhancedRecipeForm({ onSubmit, onCancel }) {
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

    const selectedIngredients = ingredients.filter(i => i.checked).map(i => i.name);
    const selectedInstructions = instructions.filter(i => i.checked).map(i => i.text);

    if (selectedIngredients.length === 0) {
      alert('Please add at least one ingredient');
      return;
    }

    if (selectedInstructions.length === 0) {
      alert('Please add at least one instruction');
      return;
    }

    if (!formData.category) {
      alert('Please select a category');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      
      // Add text fields
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('prep_time', parseInt(formData.prep_time) || 0);
      formDataToSend.append('cook_time', parseInt(formData.cook_time) || 0);
      formDataToSend.append('servings', 4);
      
      // Add ingredients and instructions as JSON strings
      formDataToSend.append('ingredients', JSON.stringify(selectedIngredients));
      formDataToSend.append('instructions', JSON.stringify(selectedInstructions));

      // DEBUG: Check image details
      console.log('formData.image:', formData.image);
      console.log('Is File?:', formData.image instanceof File);
      console.log('File size:', formData.image?.size);
      console.log('File type:', formData.image?.type);
      console.log('File name:', formData.image?.name);
      
      // Add image file if provided
      if (formData.image && formData.image instanceof File) {
        console.log('📸 Adding image with clean approach');
        
        // Just append the file directly without extra checks
        formDataToSend.append('featured_image', formData.image, formData.image.name);
        
        console.log('Image added to FormData');
      } else {
        console.log('No image selected');
      }
      
      // DEBUG: Log all FormData entries
      console.log('FormData contents:');
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}:`, value);
      }
      // REAL API call to Django with FormData
      const response = await recipeService.createRecipe(formDataToSend);
      
      // Use Django's response
      onSubmit(response.recipe);
      
    } catch (error) {
      alert('Failed to submit recipe. Please try again.');
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
            <h2 className="text-3xl font-bold text-gray-800">Add New Recipe</h2>
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
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prep Time (minutes)</label>
                <input
                  type="number"
                  name="prep_time"
                  value={formData.prep_time}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  placeholder="e.g., 15"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cook Time (minutes)</label>
                <input
                  type="number"
                  name="cook_time"
                  value={formData.cook_time}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  placeholder="e.g., 30"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Selected Ingredients</label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Recipe Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200"
              />
              {imageName && (
                <p className="mt-2 text-sm text-gray-600">Selected file: {imageName}</p>
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
                {isSubmitting ? 'Creating Recipe...' : 'Create Recipe'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EnhancedRecipeForm;