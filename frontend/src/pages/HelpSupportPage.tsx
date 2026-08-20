import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function HelpSupportPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-navy-900 to-blue-900 text-white">
      <Navbar />
      <main className="flex-grow p-10">
        <h1 className="text-4xl font-bold mb-6 text-center">Help & Support</h1>
        <div className="max-w-3xl mx-auto text-lg space-y-6 bg-white/5 border border-white/10 rounded-2xl p-8">
          <p>
            If you need help planning your trip, using our site, or have any
            questions, we're here for you!
          </p>
          <p>
            Email us at:{' '}
            <a href="mailto:craftmytravel@gmail.com" className="text-pink-400 underline">
              craftmytravel@gmail.com
            </a>
          </p>
          <p>
            Call us at: <span className="text-pink-300">+91 99999 45799</span>
          </p>
          <p>Office Address: JSSATE, Noida</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
