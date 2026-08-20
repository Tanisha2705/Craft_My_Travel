import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MapPin, Users, CalendarDays, Wallet } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TripStepper from '../components/TripStepper';

const fieldWrap = 'relative';
const inputClass =
  'w-full border border-gray-200 bg-gray-50 rounded-xl pl-11 pr-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white transition';
const iconClass = 'absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400';

const ItineraryPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prefill = (location.state as { destination?: string } | null) || {};

  const [destination, setDestination] = useState(prefill.destination || '');
  const [people, setPeople] = useState('');
  const [days, setDays] = useState('');
  const [budget, setBudget] = useState('');

  const validate = () => {
    let isValid = true;

    if (!destination.trim()) {
      toast.error('Destination is required.');
      isValid = false;
    }
    if (!people || isNaN(Number(people)) || Number(people) <= 0) {
      toast.error('Please enter a valid number of people.');
      isValid = false;
    }
    if (!days || isNaN(Number(days)) || Number(days) <= 0) {
      toast.error('Please enter a valid number of days.');
      isValid = false;
    }
    if (!budget || isNaN(Number(budget)) || Number(budget) <= 0) {
      toast.error('Please enter a valid budget.');
      isValid = false;
    }

    return isValid;
  };

  const handleNext = () => {
    if (validate()) {
      navigate('/preferences', {
        state: {
          destination,
          days: Number(days),
          people: Number(people),
          budget: Number(budget),
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-900 to-blue-900 text-white flex flex-col">
      <ToastContainer />
      <Navbar />

      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-10">
        <TripStepper current={1} />

        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">
          {/* Left: imagery / brand panel */}
          <div
            className="hidden md:flex flex-col justify-between p-10 text-white bg-cover bg-center relative"
            style={{
              backgroundImage:
                "linear-gradient(to bottom, rgba(27,31,59,0.75), rgba(236,72,153,0.55)), url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')",
            }}
          >
            <div />
            <div>
              <h2 className="text-3xl font-bold mb-3 leading-snug">
                Where to next?
              </h2>
              <p className="text-white/80">
                Give us a few details and we'll put together a day-by-day
                plan tailored to you.
              </p>
            </div>
          </div>

          {/* Right: form */}
          <div className="p-8 md:p-10 flex flex-col justify-center text-gray-900">
            <h2 className="text-2xl font-bold mb-1">Plan Your Trip</h2>
            <p className="text-gray-500 mb-8">Step 1 of 3 — the basics.</p>

            <div className="space-y-4">
              <div className={fieldWrap}>
                <MapPin size={18} className={iconClass} />
                <input
                  type="text"
                  placeholder="Destination, e.g. Goa"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className={fieldWrap}>
                  <Users size={18} className={iconClass} />
                  <input
                    type="number"
                    min={1}
                    placeholder="People"
                    value={people}
                    onChange={(e) => setPeople(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className={fieldWrap}>
                  <CalendarDays size={18} className={iconClass} />
                  <input
                    type="number"
                    min={1}
                    placeholder="Days"
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className={fieldWrap}>
                <Wallet size={18} className={iconClass} />
                <input
                  type="number"
                  min={1}
                  placeholder="Budget (in ₹)"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className={inputClass}
                />
              </div>

              <button
                onClick={handleNext}
                className="w-full bg-pink-500 text-white font-semibold py-3 rounded-xl hover:bg-pink-600 transition"
              >
                Next: Choose Preferences →
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ItineraryPage;
