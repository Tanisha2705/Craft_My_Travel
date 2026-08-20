import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TripStepper from '../components/TripStepper';
import api from '../axios';

interface ScheduleItem {
  day: string;
  image: string;
  activities: string[];
}

const SchedulePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [schedule, setSchedule] = useState<ScheduleItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { destination, days, preferences } = location.state || {};

  const handleBack = () => navigate('/preferences', { state: location.state });
  const handleStartOver = () => navigate('/itinerary');

  useEffect(() => {
    if (!destination || !days) {
      setError('Missing destination or number of days. Please start over.');
      return;
    }

    setSchedule(null);
    setError(null);

    api
      .get(`/itinerary/${encodeURIComponent(destination)}/${days}`, {
        params: preferences && preferences.length ? { preferences: preferences.join(',') } : {},
      })
      .then((res) => setSchedule(res.data.schedule))
      .catch((err) =>
        setError(
          err.response?.data?.error ||
            err.message ||
            'Could not reach the server. Make sure the backend is running on http://localhost:5050.'
        )
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destination, days, preferences]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-900 to-blue-900 text-white flex flex-col">
      <Navbar />

      <div className="flex-1 p-6 md:p-12">
        <TripStepper current={3} />

        <h1 className="text-4xl font-bold text-center mb-2">
          Your {destination ? `${destination} ` : ''}Itinerary
        </h1>
        {days && <p className="text-center text-gray-300 mb-12">{days} days, built around your picks</p>}

        {error ? (
          <div className="max-w-lg mx-auto text-center mt-16 bg-white/5 border border-red-400/30 rounded-xl p-8">
            <p className="text-lg text-red-300 mb-6">{error}</p>
            <button
              onClick={handleStartOver}
              className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition"
            >
              Start Over
            </button>
          </div>
        ) : !schedule ? (
          <div className="flex flex-col items-center justify-center mt-20 space-y-4">
            <div className="w-12 h-12 border-4 border-white/20 border-t-pink-500 rounded-full animate-spin" />
            <p className="text-lg text-gray-300">Building your itinerary...</p>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto relative">
            <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-white/20" />

            <div className="space-y-12 relative z-10">
              {schedule.map((item, index) => (
                <div key={index} className="relative flex items-start">
                  <div className="absolute left-0 top-2 w-6 h-6 bg-pink-500 rounded-full border-4 border-navy-900 shadow-lg" />
                  <div className="ml-16 bg-white text-gray-900 rounded-xl shadow-md p-6 w-full">
                    <h2 className="text-2xl font-semibold mb-4">{item.day}</h2>
                    <div className="flex flex-col md:flex-row gap-6">
                      <img
                        src={item.image}
                        alt={item.day}
                        className="w-full md:w-48 h-48 object-cover rounded-lg flex-shrink-0"
                      />
                      <ul className="list-disc list-inside text-gray-700 space-y-2">
                        {item.activities.map((activity, i) => (
                          <li key={i}>{activity}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-16">
              <button onClick={handleBack} className="text-lg hover:text-pink-300 transition">
                ← Back
              </button>
              <button
                onClick={handleStartOver}
                className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition"
              >
                Plan Another Trip
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default SchedulePage;
