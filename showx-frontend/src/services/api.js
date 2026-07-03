// src/services/api.js

// Safely pull the base backend URL from your local .env file.
// If it's not set, it will fallback to localhost:5000 as a safety measure.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const ENTERTAINMENT_DATABASE = [
  // --- MOVIES ---
  { 
    id: 'm1', 
    title: 'Welcome To The Jungle', 
    type: 'movie', 
    genre: 'Comedy / Adventure', 
    rating: '8.4', 
    language: 'Hindi', 
    format: '2D / Dolby Cinema', 
    duration: '142 min', 
    tag: 'Mass Entertainer',
    description: 'An adrenaline-fueled laughter riot where an elite squad finds themselves trapped in a dense tropical wilderness, dealing with unexpected wildlife, hilarious misfires, and high-stakes rescue challenges.',
    cast: [
      { name: 'Akshay Kumar', role: 'Lead Actor', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop' },
      { name: 'Sanjay Dutt', role: 'Supporting', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop' },
      { name: 'Suniel Shetty', role: 'Supporting', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop' }
    ],
    crew: [
      { name: 'Ahmed Khan', role: 'Director' },
      { name: 'Firoz Nadiadwala', role: 'Producer' }
    ]
  },
  { 
    id: 'm3', 
    title: 'Main Vaapas Aaunga', 
    type: 'movie', 
    genre: 'Drama / Musical', 
    rating: '9.1', 
    language: 'Hindi', 
    format: '2D Standard', 
    duration: '154 min', 
    tag: 'Imtiaz Ali Musical',
    description: 'A deep, poetic exploration of love, lost artistic genius, and personal resurrection set against the haunting melodies of northern valley landscapes.',
    cast: [
      { name: 'Ranbir Kapoor', role: 'Lead Actor', img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=150&auto=format&fit=crop' },
      { name: 'Alia Bhatt', role: 'Lead Actress', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop' }
    ],
    crew: [
      { name: 'Imtiaz Ali', role: 'Director' },
      { name: 'A.R. Rahman', role: 'Music Director' }
    ]
  },
  { 
    id: 'm4', 
    title: 'Cocktail 2', 
    type: 'movie', 
    genre: 'Rom-Com', 
    rating: '8.0', 
    language: 'Hindi', 
    format: '2D / Atmos', 
    duration: '132 min', 
    tag: 'Trending Now',
    description: 'A modern relationship comedy exploring multi-city friendship dynamics, heartbreaks, and messy professional tie-ups in London and Mumbai.',
    cast: [
      { name: 'Deepika Padukone', role: 'Lead Actress', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop' }
    ],
    crew: [{ name: 'Homi Adajania', role: 'Director' }]
  },

  // --- STREAMS ---
  { 
    id: 's1', 
    title: 'Interstellar Odyssey', 
    type: 'stream', 
    genre: 'Sci-Fi / Adventure', 
    rating: '9.5', 
    language: 'English', 
    format: '4K Digital Stream', 
    price: '₹149', 
    tag: 'Premium Excl',
    description: 'A stunning space exploratory chronicle deep inside theoretical wormholes, balancing deep physics mechanics with an emotional parental bond.',
    cast: [{ name: 'Matthew McConaughey', role: 'Cooper', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop' }],
    crew: [{ name: 'Christopher Nolan', role: 'Director' }]
  },

  // --- EVENTS ---
  { 
    id: 'e1', 
    title: 'Arijit Singh Live In Concert', 
    type: 'events', 
    genre: 'Music / Pop', 
    rating: '9.8', 
    language: 'Hindi', 
    date: 'OCT 24, 2026', 
    venue: 'HUDA Ground, Karnal', 
    tag: 'Selling Fast',
    description: 'Experience an enchanting starlit evening with India’s voice of love, performing his legendary record-breaking hits live with an amplified orchestra layout setup.',
    cast: [{ name: 'Arijit Singh', role: 'Main Artist', img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=150&auto=format&fit=crop' }],
    crew: [{ name: 'TM Ventures', role: 'Organizer' }]
  }
];

const simulateNetworkRequest = (dataResolver, delay = 200) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(dataResolver()), delay);
  });
};

export const fetchAllMovies = () => {
  return simulateNetworkRequest(() => ENTERTAINMENT_DATABASE.filter(item => item.type === 'movie'));
};

export const fetchItemsByType = (type) => {
  return simulateNetworkRequest(() => ENTERTAINMENT_DATABASE.filter(item => item.type === type));
};

export const fetchItemById = (id) => {
  return simulateNetworkRequest(() => {
    return ENTERTAINMENT_DATABASE.find(item => item.id === id) || ENTERTAINMENT_DATABASE[0];
  });
};

export const fetchMovieById = fetchItemById;

export const fetchBookedSeats = () => {
  return simulateNetworkRequest(() => ['B-10', 'C-8', 'C-9', 'C-10']);
};

// --- NEW OPERATIONALLY DYNAMIC METHOD ---
// This uses the environment variables to connect directly to your live backend server endpoints.
export const fetchLiveCollectionNode = async (endpointPath) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpointPath}`);
    return await response.json();
  } catch (error) {
    console.error("Showx Core Database connectivity failure using endpoint address:", error);
    return null;
  }
};