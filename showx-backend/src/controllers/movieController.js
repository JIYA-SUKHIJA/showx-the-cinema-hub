import Movie from "../models/Movie.js";

export const createMovie = async (req, res) => {
  try {
    const movie = await Movie.create(req.body);

    res.status(201).json({
      success: true,
      message: "Movie created successfully",
      movie,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error creating movie",
      error: error.message,
    });
  }
};

// Handles listing, search (?search=), and filter (?genre=, ?language=)
export const getMovies = async (req, res) => {
  try {
    const { search, genre, language } = req.query;

    const filter = { isActive: true, type: "movie" };

    if (search) {
      filter.$text = { $search: search };
    }

    if (genre) {
      filter.genre = { $regex: genre, $options: "i" };
    }

    if (language) {
      filter.language = language;
    }

    const movies = await Movie.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: movies.length,
      movies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error fetching movies",
      error: error.message,
    });
  }
};

export const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    res.status(200).json({
      success: true,
      movie,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error fetching movie",
      error: error.message,
    });
  }
};

export const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Movie updated successfully",
      movie,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error updating movie",
      error: error.message,
    });
  }
};

export const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Movie deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error deleting movie",
      error: error.message,
    });
  }
};

// @route   GET /api/movies/releases
// @desc    All released movies (releaseDate today or in the past), newest first
// @access  Public
export const getReleases = async (req, res) => {
  try {
    const now = new Date();

    const movies = await Movie.find({
      isActive: true,
      type: "movie",
      $or: [{ releaseDate: { $lte: now } }, { releaseDate: null }],
    }).sort({ releaseDate: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: movies.length,
      movies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error fetching releases",
      error: error.message,
    });
  }
};

// @route   GET /api/movies/upcoming
// @desc    Movies with a releaseDate set in the future
// @access  Public
export const getUpcomingMovies = async (req, res) => {
  try {
    const now = new Date();

    const movies = await Movie.find({
      isActive: true,
      type: "movie",
      releaseDate: { $gt: now },
    }).sort({ releaseDate: 1 });

    res.status(200).json({
      success: true,
      count: movies.length,
      movies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error fetching upcoming movies",
      error: error.message,
    });
  }
};