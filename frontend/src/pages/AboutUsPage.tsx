import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function AboutUsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-navy-900 to-blue-900 text-white">
      <Navbar />
      <main className="flex-grow p-10">
        <h1 className="text-4xl font-bold mb-6 text-center">About Us</h1>
        <div className="max-w-3xl mx-auto text-lg space-y-6 bg-white/5 border border-white/10 rounded-2xl p-8">
          <p>
            Welcome to <strong>CraftMyTravel</strong> — your personalized travel
            planner! We're passionate about helping you create the perfect
            itinerary for any destination.
          </p>
          <p>
            Our team is made up of travel enthusiasts, designers, and
            engineers who want to make travel planning fun, easy, and
            tailored to your interests.
          </p>
          <p>
            We believe every journey is unique. Let us help you design one
            that's truly unforgettable.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
