import "dotenv/config";
import mongoose from "mongoose";
import Movie from "../models/Movie.js";

const sampleMovies = [
  {
    title: "Welcome To The Jungle",
    type: "movie",
    poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600&auto=format&fit=crop",
    genre: "Comedy / Adventure",
    rating: "8.4",
    language: "Hindi",
    format: "2D / Dolby Cinema",
    duration: "142 min",
    tag: "Mass Entertainer",
    description: "An adrenaline-fueled laughter riot where an elite squad finds themselves trapped in a dense tropical wilderness, dealing with unexpected wildlife, hilarious misfires, and high-stakes rescue challenges.",
    cast: [
      { name: "Akshay Kumar", role: "Lead Actor", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop" },
      { name: "Sanjay Dutt", role: "Supporting", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop" },
    ],
    crew: [{ name: "Ahmed Khan", role: "Director" }],
  },
  {
    title: "Main Vaapas Aaunga",
    type: "movie",
    poster: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=600&auto=format&fit=crop",
    genre: "Drama / Musical",
    rating: "9.1",
    language: "Hindi",
    format: "2D Standard",
    duration: "154 min",
    tag: "Imtiaz Ali Musical",
    description: "A deep, poetic exploration of love, lost artistic genius, and personal resurrection set against the haunting melodies of northern valley landscapes.",
    cast: [
      { name: "Ranbir Kapoor", role: "Lead Actor", img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=150&auto=format&fit=crop" },
      { name: "Alia Bhatt", role: "Lead Actress", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" },
    ],
    crew: [
      { name: "Imtiaz Ali", role: "Director" },
      { name: "A.R. Rahman", role: "Music Director" },
    ],
  },
  {
    title: "Cocktail 2",
    type: "movie",
    poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=600&auto=format&fit=crop",
    genre: "Rom-Com",
    rating: "8.0",
    language: "Hindi",
    format: "2D / Atmos",
    duration: "132 min",
    tag: "Trending Now",
    description: "A modern relationship comedy exploring multi-city friendship dynamics, heartbreaks, and messy professional tie-ups in London and Mumbai.",
    cast: [
      { name: "Deepika Padukone", role: "Lead Actress", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop" },
    ],
    crew: [{ name: "Homi Adajania", role: "Director" }],
  },
  {
    title: "Alpha",
    type: "movie",
    poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=600&auto=format&fit=crop",
    genre: "Action / Thriller",
    rating: "8.7",
    language: "Hindi",
    format: "IMAX 3D",
    duration: "148 min",
    tag: "Blockbuster",
    description: "A high-stakes espionage thriller following an elite agent uncovering a conspiracy that threatens national security.",
    cast: [
      { name: "Alia Bhatt", role: "Lead Actress", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" },
    ],
    crew: [{ name: "Shiv Rawail", role: "Director" }],
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected for seeding...");

    await Movie.deleteMany({});
    console.log("Existing movies cleared.");

    const inserted = await Movie.insertMany(sampleMovies);
    console.log(`${inserted.length} movies inserted successfully.`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error.message);
    process.exit(1);
  }
};

seedDatabase();