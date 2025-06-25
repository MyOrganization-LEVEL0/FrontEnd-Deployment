// src/pages/Landing/Landing.js
import React from 'react';
import { Link } from 'react-router-dom';
import RecipeCard from '../../components/cards/RecipeCard';
import ContactForm from '../../components/forms/ContactForm';

const Landing = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="pastel-gradient py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
            Discover Delicious Homemade Desserts
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8">
            Explore our collection of easy-to-follow recipes for cakes, cookies, pastries, and more!
          </p>
          <Link to="/recipes" className="bg-white text-pink-500 font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 inline-block">
            Browse Recipes
          </Link>
        </div>
      </section>

      {/* Top Recipes Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Our Top Recipes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <RecipeCard
              color="pink"
              title="Strawberry Shortcake"
              description="A classic dessert with layers of sweet cake, fresh strawberries, and whipped cream."
              time="30 minutes"
            />
            <RecipeCard
              color="yellow"
              title="Lemon Cheesecake"
              description="Creamy cheesecake with a bright lemon flavor and graham cracker crust."
              time="1 hour"
            />
            <RecipeCard
              color="green"
              title="Mint Chocolate Cookies"
              description="Rich chocolate cookies with refreshing mint chips, perfect for any occasion."
              time="45 minutes"
            />
          </div>
          <div className="text-center mt-12">
            <Link to="/categories" className="bg-blue-100 text-blue-500 font-semibold px-6 py-3 rounded-full hover:bg-blue-200 transition inline-block">
              See Categories
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 pastel-gradient">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Contact Us</h2>
            <p className="text-center text-gray-600 mb-8">
              Have questions or suggestions? We'd love to hear from you!
            </p>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
};

export default Landing;