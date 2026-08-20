import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TripStepper from '../components/TripStepper';

const PreferencesPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { destination, people, days, budget } = location.state || {};

  const allPreferences: string[] = [
    'Must-see Attractions',
    'Hidden Gems',
    'Himalayan Treks',
    'Arts & Theatre',
    'Snow Sports',
    'Local Cuisine',
    'Cultural Landmarks',
    'Adventure and Sports',
    'Culture',
  ];

  const [selectedPrefs, setSelectedPrefs] = useState<string[]>([]);

  const togglePreference = (pref: string): void => {
    setSelectedPrefs((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    );
  };

  const handleBack = (): void => {
    navigate('/itinerary', { state: { destination } });
  };

  const handleNext = (): void => {
    if (!destination || !people || !days || !budget) {
      toast.error('Missing trip details. Please go back and fill the itinerary first.');
      return;
    }

    if (selectedPrefs.length === 0) {
      toast.error('Please select at least one preference.');
      return;
    }

    navigate('/schedule', {
      state: {
        destination,
        people,
        days,
        budget,
        preferences: selectedPrefs,
      },
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-navy-900 to-blue-900 text-white">
      <ToastContainer />
      <Navbar />

      <main className="flex-grow p-6 md:p-12">
        <TripStepper current={2} />

        <h1 className="text-4xl font-bold text-center mb-2">
          What are you into, {destination ? `for your trip to ${destination}` : ''}?
        </h1>
        <p className="text-center text-gray-300 mb-12">
          Pick as many as you like — we'll build your days around them.
        </p>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {allPreferences.map((pref) => (
              <button
                key={pref}
                onClick={() => togglePreference(pref)}
                className={`rounded-full py-3 px-6 shadow-md transition-all text-center font-medium border-2
                  ${
                    selectedPrefs.includes(pref)
                      ? 'bg-pink-500 border-pink-500 text-white shadow-lg scale-[1.02]'
                      : 'bg-white/5 border-white/20 text-white hover:border-pink-400'
                  }`}
              >
                {pref}
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center mt-12">
            <button onClick={handleBack} className="text-lg hover:text-pink-300 transition">
              ← Back
            </button>
            <button
              onClick={handleNext}
              className="bg-pink-500 text-white px-8 py-3 rounded-lg hover:bg-pink-600 transition-colors font-semibold"
            >
              Generate My Schedule →
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PreferencesPage;
