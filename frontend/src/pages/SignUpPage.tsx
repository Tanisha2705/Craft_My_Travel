import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../axios';
import { Eye, EyeOff, User, Mail, Phone, Lock, Plane } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface SignupForm {
  name: string;
  email: string;
  phone: string;
  password: string;
}

const fieldWrap = 'relative';
const inputClass =
  'w-full border border-gray-200 bg-gray-50 rounded-xl pl-11 pr-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white transition';
const iconClass = 'absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400';

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<SignupForm>({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { name, email, phone, password } = formData;

    if (!name || !email || !phone || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await api.post('/signup', {
        username: name.trim().toLowerCase().replace(/\s+/g, '_') || email.split('@')[0],
        name,
        email,
        phone,
        password,
      });

      // Auto-login right after signup so the visitor lands straight in the app.
      const loginRes = await api.post('/login', { email, password });
      localStorage.setItem('token', loginRes.data.token);
      localStorage.setItem('user', JSON.stringify(loginRes.data.user));

      navigate('/itinerary');
    } catch (err: any) {
      if (err.code === 'ERR_NETWORK') {
        setError('Could not reach the server. Is the backend running?');
      } else {
        setError(err.response?.data?.error || 'Signup failed. Try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-navy-900 to-blue-900">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 md:p-10">
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">
          {/* Left: imagery / brand panel */}
          <div
            className="hidden md:flex flex-col justify-between p-10 text-white bg-cover bg-center relative"
            style={{
              backgroundImage:
                "linear-gradient(to bottom, rgba(27,31,59,0.75), rgba(236,72,153,0.55)), url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')",
            }}
          >
            <div className="flex items-center space-x-2">
              <Plane className="h-7 w-7" />
              <span className="text-lg font-bold">CraftMyTravel</span>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-3 leading-snug">
                Start planning your next adventure today.
              </h2>
              <p className="text-white/80">
                Create a free account to save your trips and get a
                personalized itinerary in minutes.
              </p>
            </div>
          </div>

          {/* Right: form */}
          <div className="p-8 md:p-10 flex flex-col justify-center">
            <h2 className="text-2xl font-bold mb-1">Create your account</h2>
            <p className="text-gray-500 mb-8">It only takes a minute.</p>

            <form className="space-y-4" onSubmit={handleSignup}>
              <div className={fieldWrap}>
                <User size={18} className={iconClass} />
                <input
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div className={fieldWrap}>
                <Mail size={18} className={iconClass} />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div className={fieldWrap}>
                <Phone size={18} className={iconClass} />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div className={fieldWrap}>
                <Lock size={18} className={iconClass} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password (min. 6 characters)"
                  value={formData.password}
                  onChange={handleChange}
                  className={inputClass + ' pr-11'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {error && (
                <div className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-pink-500 text-white font-semibold py-3 rounded-xl hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-300 transition disabled:opacity-60"
              >
                {submitting ? 'Creating account...' : 'Sign Up'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-500">Already have an account? </span>
              <button onClick={() => navigate('/login')} className="text-pink-600 hover:text-pink-700 font-medium">
                Log in
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SignUpPage;
