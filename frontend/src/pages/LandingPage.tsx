import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface Destination {
  name: string;
  description: string;
  image: string;
  tags: string[];
}

const destinations: Destination[] = [
  {
    name: 'Kashmir',
    description:
      'Kashmir, known as "Paradise on Earth," offers breathtaking landscapes of snow-capped mountains, serene lakes, and lush valleys. A haven for nature lovers, it provides unforgettable experiences with rich culture, adventure, and tranquility.',
    image:
      'https://images.unsplash.com/photo-1566837945700-30057527ade0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tags: ['Nature', 'Lakes', 'Adventure'],
  },
  {
    name: 'Shimla',
    description:
      'Shimla, the queen of hill stations, captivates with its colonial charm, lush pine forests, and scenic views. Ideal for nature lovers and weekend visitors, it offers a peaceful retreat with thrilling adventures and cultural experiences.',
    image:
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tags: ['Hills', 'Colonial charm', 'Weekend getaway'],
  },
  {
    name: 'Goa',
    description:
      'Goa, a vibrant coastal paradise, is known for its pristine beaches, lively nightlife, and rich Portuguese heritage. A perfect blend of relaxation and adventure, it offers water sports, vibrant markets, and serene escapes for every traveler.',
    image:
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tags: ['Beaches', 'Nightlife', 'Water sports'],
  },
  {
    name: 'Manali',
    description:
      'Manali is a Himalayan resort town famous for its snow-capped peaks, adventure sports, and cool mountain air. From paragliding over the Solang Valley to soaking in the Vashisht hot springs, it is a magnet for adventure seekers and honeymooners alike.',
    image:
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tags: ['Mountains', 'Adventure sports', 'Valleys'],
  },
  {
    name: 'Dehradun',
    description:
      'Dehradun, nestled in the Doon Valley, is a gateway to the Himalayas with lush tea gardens, ancient temples, and a pleasant climate year-round. It is the perfect base for exploring nearby Mussoorie and Rishikesh.',
    image:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tags: ['Valley', 'Temples', 'Tea gardens'],
  },
  {
    name: 'Jaipur',
    description:
      'Jaipur, the Pink City, dazzles with majestic forts, ornate palaces, and bustling bazaars. Steeped in Rajasthani royalty, it offers a vivid journey through history, architecture, and vibrant local craftsmanship.',
    image:
      'https://images.unsplash.com/photo-1477587458883-47145ed94245?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tags: ['Forts & palaces', 'Culture', 'Bazaars'],
  },
];

function LandingPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Destination>(destinations[0]);

  const handlePlanFor = (destinationName: string) => {
    navigate('/itinerary', { state: { destination: destinationName } });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section
        className="relative h-[600px] bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-5xl font-bold mb-4 leading-tight">
              Life is a Journey and every Journey deserves a plan
            </h1>
            <p className="text-lg text-gray-200 mb-8">
              Tell us where you want to go, and we'll build you a day-by-day
              itinerary tailored to your interests and budget.
            </p>
            <button
              onClick={() => navigate('/itinerary')}
              className="bg-pink-500 text-white px-8 py-3 rounded-full hover:bg-pink-600 transition text-lg font-semibold shadow-lg"
            >
              Plan My Trip →
            </button>
          </div>
          <div className="hidden lg:block absolute right-16 top-20 space-y-4">
            <img
              src="https://images.unsplash.com/photo-1626981892174-a793b72d06a8?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3"
              alt="Travel"
              className="w-64 h-64 object-cover rounded-lg shadow-lg mx-auto"
            />
            <img
              src="https://images.unsplash.com/photo-1520939817895-060bdaf4fe1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
              className="rounded-lg shadow-xl"
              alt="City"
            />
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="bg-navy-900 text-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-8">About Us</h2>
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-1/2">
              <p className="text-lg leading-relaxed mb-6">
                Welcome to CraftMyTravel, your ultimate travel companion! We
                specialize in crafting personalized travel itineraries that
                transform your wanderlust into reality.
              </p>
              <p className="text-lg leading-relaxed">
                Our mission is simple: to make travel planning effortless and
                enjoyable. Whether you're exploring exotic destinations,
                embarking on a weekend getaway, or planning the trip of a
                lifetime, we are here to ensure every detail is taken care of
                so you can focus on what matters most — making memories.
              </p>
            </div>
            <div className="lg:w-1/2 grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1551918120-9739cb430c6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                className="rounded-lg shadow-xl"
                alt="Travel 1"
              />
              <img
                src="https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                className="rounded-lg shadow-xl"
                alt="Food"
              />
              <img
                src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                className="rounded-lg shadow-xl"
                alt="City Night"
              />
              <img
                src="https://images.unsplash.com/photo-1445019980597-93fa8acb246c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                className="rounded-lg shadow-xl"
                alt="Nature"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Destinations Section — now interactive */}
      <section className="py-20 bg-gradient-to-b from-navy-900 to-blue-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white mb-2 text-center">
            Popular Destinations
          </h2>
          <p className="text-center text-gray-300 mb-12">
            Click a place to learn more about it
          </p>

          {/* City picker */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {destinations.map((dest) => (
              <button
                key={dest.name}
                onClick={() => setSelected(dest)}
                className={`px-6 py-2 rounded-full font-medium transition-all border-2 ${
                  selected.name === dest.name
                    ? 'bg-pink-500 border-pink-500 text-white shadow-lg scale-105'
                    : 'bg-transparent border-white/30 text-white hover:border-pink-400 hover:text-pink-300'
                }`}
              >
                {dest.name}
              </button>
            ))}
          </div>

          {/* Selected destination detail card */}
          <div
            key={selected.name}
            className="max-w-4xl mx-auto bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-fadeIn"
          >
            <div className="flex flex-col md:flex-row">
              <img
                src={selected.image}
                alt={selected.name}
                className="w-full md:w-1/2 h-64 md:h-auto object-cover"
              />
              <div className="p-8 md:w-1/2 flex flex-col justify-center">
                <h3 className="text-3xl font-bold text-white mb-4">
                  {selected.name}
                </h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {selected.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {selected.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-white/10 text-pink-300 px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => handlePlanFor(selected.name)}
                  className="self-start bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition font-semibold"
                >
                  Plan a trip to {selected.name} →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default LandingPage;
