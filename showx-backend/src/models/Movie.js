import mongoose from "mongoose";

const personSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    img: { type: String },
  },
  { _id: false }
);

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Movie title is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["movie", "stream", "events", "plays"],
      default: "movie",
    },
    poster: {
      type: String,
      required: [true, "Poster image URL is required"],
    },
    heroFocusY: {
      type: String,
      default: "center",
    },
    genre: {
      type: String,
      required: [true, "Genre is required"],
    },
    rating: {
      type: String,
      default: "8.0",
    },
    language: {
      type: String,
      required: [true, "Language is required"],
    },
    format: {
      type: String,
      default: "2D Standard",
    },
    duration: {
      type: String,
      required: [true, "Duration is required"],
    },
    tag: {
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

movieSchema.index(
  { title: "text", description: "text" },
  { language_override: "textLanguage" }
);

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;

