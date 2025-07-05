# 🚀 Django Backend Integration - Copy & Replace Guide

## Step 1: Install Dependencies

Run this command in your project root:

```bash
npm install axios
```

## Step 2: Create New Files

Create these **NEW** files in your project (copy exactly as shown):

### 📁 Create `.env.local` in your root directory
```env
REACT_APP_API_BASE_URL=http://localhost:8000/api
REACT_APP_ENVIRONMENT=development
```

### 📁 Create `src/services/` directory and add these files:
- `src/services/api.js` 
- `src/services/authService.js`
- `src/services/recipeService.js`

### 📁 Create `src/contexts/` directory and add:
- `src/contexts/AuthContext.js`

### 📁 Create `src/hooks/` directory and add:
- `src/hooks/useRecipes.js`

### 📁 Create `src/components/auth/` directory and add:
- `src/components/auth/ProtectedRoute.js`

## Step 3: Replace Existing Files

Replace these **EXISTING** files with the new versions:

- ✅ `src/App.js`
- ✅ `src/pages/Login/Login.js`
- ✅ `src/pages/SignUp/SignUp.js`
- ✅ `src/pages/ForgotPassword/ForgotPassword.js`
- ✅ `src/components/common/Navigation.js`
- ✅ `package.json`

## Step 4: Update .gitignore

Add these lines to your `.gitignore` file:

```gitignore
# Environment files
.env.local
.env.production
.env.development
```

## Step 5: Start Your Application

```bash
npm start
```

## 🎯 What Changed?

### ✨ **New Features Added:**
- **Real API Integration** - Connects to Django backend
- **Authentication Context** - Manages user state globally
- **Protected Routes** - Dashboard access based on user roles
- **Error Handling** - Proper error messages from backend
- **Token Management** - Automatic token handling
- **Role-based Navigation** - Different dashboard links based on user role

### 🔧 **Files Modified:**
- **Login/SignUp** - Now make real API calls to Django
- **Navigation** - Shows user info and logout when authenticated
- **App.js** - Added AuthProvider and ProtectedRoute
- **Package.json** - Added axios dependency and proxy for development

### 🛡️ **Security Features:**
- Automatic token refresh
- Logout on 401 errors
- Protected dashboard routes
- Secure token storage

## 🔌 Django Backend Requirements

Your Django backend needs these endpoints:

```python
# Authentication endpoints
POST /api/auth/login/
POST /api/auth/signup/
POST /api/auth/logout/
POST /api/auth/forgot-password/

# Recipe endpoints  
GET /api/recipes/
GET /api/recipes/{id}/
POST /api/recipes/
PUT /api/recipes/{id}/
DELETE /api/recipes/{id}/
GET /api/recipes/search/?q={query}
POST /api/recipes/{id}/comments/
GET /api/recipes/{id}/comments/
```

## 🚨 Important Notes:

1. **Environment Variables**: Update `.env.local` with your actual Django API URL
2. **CORS Settings**: Make sure your Django backend allows requests from `http://localhost:3000`
3. **Token Format**: Backend should return `{ "token": "...", "user": {...} }` on login/signup
4. **User Roles**: Backend should include user role in the user object for dashboard access

## ✅ Testing the Integration:

1. Start your Django backend on `http://localhost:8000`
2. Start your React app with `npm start`
3. Try logging in - it should make a real API call
4. Check browser Network tab to see API requests
5. Dashboard routes should be protected based on authentication

Your app will now work with both mock data (fallback) and real Django API calls! 🎉