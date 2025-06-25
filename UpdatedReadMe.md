# BASTA Desserts - React Frontend

A modern React application for BASTA Desserts, a website that provides Filipino dessert recipes.

## 🚀 Project Overview

BASTA Desserts is a full-stack web application designed to share and discover authentic Filipino dessert recipes. This repository contains the React frontend, built with modern web technologies and best practices.

## 📸 Features

### Core Features
- **Recipe Discovery**: Browse and search through a collection of Filipino desserts
- **Recipe Details**: View complete recipes with ingredients, instructions, and nutritional info
- **User Authentication**: Login and signup functionality
- **User Dashboard**: Manage personal recipes, favorites, and account settings
- **Search & Filter**: Advanced search with filters for difficulty, cooking time, and categories
- **Responsive Design**: Mobile-first approach with support for all devices
- **Categories**: Organized recipes by dessert types (Kakanin, Bibingka, Leche Flan, etc.)

### Pages Implemented
- **Landing Page** (`/`) - Homepage with featured recipes and contact form
- **Recipe Listing** (`/recipes`) - Browse all recipes with alphabetical navigation
- **Recipe Detail** (`/recipe/:id`) - Full recipe view with step-by-step instructions
- **Categories** (`/categories`) - Browse recipes by category
- **Search Results** (`/search`) - Search with advanced filters
- **User Dashboard** (`/dashboard`) - Personal recipe management
- **About Us** (`/about`) - Team information
- **Login/SignUp** (`/login`, `/signup`) - User authentication

## 🛠️ Technology Stack

- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **JavaScript ES6+** - Modern JavaScript features
- **HTML5 & CSS3** - Semantic markup and styling

## 📁 Project Structure

```
basta-desserts/
├── public/
│   ├── index.html
│   └── imgs/              # Images for team members and recipes
├── src/
│   ├── App.js            # Main app component with routing
│   ├── App.css           # Global styles
│   ├── index.js          # Entry point
│   ├── components/       # Reusable components
│   │   ├── common/
│   │   │   ├── Navigation.js
│   │   │   ├── Navigation.css
│   │   │   ├── Footer.js
│   │   │   └── Footer.css
│   │   ├── cards/
│   │   │   ├── RecipeCard.js
│   │   │   ├── CategoryCard.js
│   │   │   ├── TeamMemberCard.js
│   │   │   └── Cards.css
│   │   └── forms/
│   │       ├── ContactForm.js
│   │       └── Forms.css
│   ├── pages/           # Page components
│   │   ├── Landing/
│   │   ├── Categories/
│   │   ├── About/
│   │   ├── Recipes/
│   │   ├── RecipeDetail/
│   │   ├── Dashboard/
│   │   ├── SearchResults/
│   │   ├── Login/
│   │   └── SignUp/
│   ├── data/           # Static data
│   │   ├── categories.js
│   │   └── teamMembers.js
│   └── utils/          # Utility functions
│       └── constants.js
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/basta-desserts.git
   cd basta-desserts
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## 🔗 API Integration (Next Steps)

The frontend is prepared for backend integration with these planned endpoints:

### Authentication
- `POST /api/auth/login/` - User login
- `POST /api/auth/register/` - User registration
- `POST /api/auth/logout/` - User logout
- `POST /api/auth/refresh/` - Refresh JWT token

### Recipes
- `GET /api/recipes/` - List all recipes
- `GET /api/recipes/:id/` - Get single recipe
- `POST /api/recipes/` - Create new recipe
- `PUT /api/recipes/:id/` - Update recipe
- `DELETE /api/recipes/:id/` - Delete recipe

### User Management
- `GET /api/users/profile/` - Get user profile
- `PUT /api/users/profile/` - Update profile
- `GET /api/users/dashboard/` - Dashboard data

### Categories
- `GET /api/categories/` - List all categories
- `GET /api/categories/:id/recipes/` - Get recipes by category

## 🎨 Design Features

- **Pastel Color Scheme**: Soft, appealing colors perfect for a dessert website
- **Custom Gradient Text**: Eye-catching logo with gradient effect
- **Card-Based Layout**: Easy to browse recipe cards
- **Responsive Grid System**: Adapts to all screen sizes
- **Interactive Elements**: Hover effects, transitions, and animations
- **Accessibility**: Semantic HTML and ARIA labels

## 👥 Development Team

- **Billie Earl Angeles** - Full-stack Developer & Cyber Security
- **Jerico Armendi** - Frontend Developer & UX Design
- **John Vincent Baga** - Backend Developer & Data Science
- **Abdul Didaagun** - Backend Developer
- **Anton Ramos** - Software Engineer
- **Paula Nicole Reyes** - System Administrator
- **John Michael Villarosa** - Systems Optimization & AI

## 📝 Future Enhancements

- [ ] PWA (Progressive Web App) support
- [ ] Offline recipe viewing
- [ ] Multi-language support (English/Tagalog)
- [ ] Recipe rating and review system
- [ ] Social sharing features
- [ ] Recipe collections/playlists
- [ ] Advanced search with ingredient filters
- [ ] Cooking mode with timers
- [ ] Video tutorials integration
- [ ] Regional recipe variations

## 🐛 Known Issues

- Images are using placeholder paths - need to add actual images
- Mock data is hardcoded - needs API integration
- Form validation needs enhancement
- Authentication state management not implemented

## 📄 License

© 2025 BASTA Desserts. All rights reserved.

## 🤝 Contributing

This is a academic project. For contributions, please contact the development team.

## 📞 Contact

For questions or support, please reach out to the development team through the contact form on the website.

---

**Note**: This is the frontend repository. The Django backend is being developed separately and will be integrated once both parts are complete.