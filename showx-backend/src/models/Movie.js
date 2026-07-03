import mongoose from "mongoose";

// A sub-schema for individual cast/crew members.
// We don't create a separate Model for this since cast/crew
// only ever exist as part of a movie — no need for their own collection.
const personSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    img: { type: String }, // only cast has images in the frontend, crew doesn't need it
  },
  { _id: false } // don't generate a separate _id for each cast/crew entry
);

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Movie title is required"],
      trim: true,
    },
    type: {
      // Matches frontend's generic entertainment system.
      // Locked to "movie" for this module; "stream"/"events" can be
      // added later if you expand ShowX beyond just movies.
      type: String,
      enum: ["movie", "stream", "events", "plays"],
      default: "movie",
    },
    poster: {
      // Matches frontend field name exactly (not "posterUrl")
      type: String,
      required: [true, "Poster image URL is required"],
    },
    genre: {
      // Stored as a single string like "Comedy / Adventure",
      // matching how the frontend displays it directly.
      type: String,
      required: [true, "Genre is required"],
    },
    rating: {
      // Stored as a String ("8.4") since that's how MovieCard.jsx renders it directly.
      type: String,
      default: "8.0",
    },
    language: {
      type: String,
      required: [true, "Language is required"],
    },
    format: {
      // e.g. "2D / Dolby Cinema", "2D Standard"
      type: String,
      default: "2D Standard",
    },
    duration: {
      // Stored as a string like "142 min" to match frontend display directly
      type: String,
      required: [true, "Duration is required"],
    },
    tag: {
      // e.g. "Mass Entertainer", "Trending Now" — optional badge shown on card
      type: String,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    cast: {
      type: [personSchema],
      default: [],
    },
    crew: {
      type: [personSchema],
      default: [],
    },
    releaseDate: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Text index for search functionality (title + description).
// language_override tells MongoDB to look for a field called "textLanguage"
// (which we don't have) instead of our own "language" field when deciding
// text-search stemming rules. Without this, MongoDB tries to treat our
// "Hindi" value as a text-search language code and throws an error.
movieSchema.index(
  { title: "text", description: "text" },
  { language_override: "textLanguage" }
);

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;