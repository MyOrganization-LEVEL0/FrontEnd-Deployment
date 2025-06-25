// src/pages/About/About.js
import React from 'react';
import TeamMemberCard from '../../components/cards/TeamMemberCard';
import { teamMembers } from '../../data/teamMembers';

const About = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="pastel-gradient py-16 md:py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">Meet Our Team</h1>
          <p className="text-lg md:text-xl text-gray-700 mb-4">
            The passionate bakers and developers behind BASTA Desserts
          </p>
          <div className="w-24 h-1 bg-pink-300 mx-auto rounded-full"></div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Story</h2>
            <p className="text-gray-600 leading-relaxed">
              BASTA Desserts was founded by a group of passionate college students who shared a love for baking and technology.
              What started as a small project for a web development class quickly turned into a platform where dessert enthusiasts
              could find, share, and create delicious recipes. Our team combines diverse skills to bring you the sweetest online experience.
            </p>
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-800">Meet The Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {teamMembers.map((member, index) => (
              <TeamMemberCard key={index} {...member} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default About;