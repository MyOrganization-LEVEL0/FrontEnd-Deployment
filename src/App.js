// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/common/Navigation';
import Footer from './components/common/Footer';
import Landing from './pages/Landing/Landing';
import Categories from './pages/Categories/Categories';
import About from './pages/About/About';
import Recipes from './pages/Recipes/Recipes';
import RecipeDetail from './pages/RecipeDetail/RecipeDetail';
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';
import Dashboard from './pages/Dashboard/Dashboard';
import SearchResults from './pages/SearchResults/SearchResults';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Routes>
          <Route path="/login" element={
            <>
              <Navigation />
              <Login />
              <Footer />
            </>
          } />
          <Route path="/signup" element={
            <>
              <Navigation />
              <SignUp />
              <Footer />
            </>
          } />
          <Route path="*" element={
            <>
              <Navigation />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/recipes" element={<Recipes />} />
                  <Route path="/recipe/:id" element={<RecipeDetail />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/search" element={<SearchResults />} />
                </Routes>
              </main>
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;