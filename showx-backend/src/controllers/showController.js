import Show from "../models/Show.js";

export const createShow = async (req, res) => {
  try {
    const show = await Show.create(req.body);
    res.status(201).json({ success: true, show });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error creating show", error: error.message });
  }
};

export const getShows = async (req, res) => {
  try {
    const { movieId, theatreId } = req.query;
    const filter = { isActive: true };
    if (movieId) filter.movie = movieId;
    if (theatreId) filter.theatre = theatreId;

    const shows = await Show.find(filter)
      .populate("movie", "title poster")
      .populate("theatre", "name location formats")
      .sort({ showDate: 1 });

    res.status(200).json({ success: true, count: shows.length, shows });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error fetching shows", error: error.message });
  }
};

export const getShowById = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate("movie")
      .populate("theatre");

    if (!show) {
      return res.status(404).json({ success: false, message: "Show not found" });
    }
    res.status(200).json({ success: true, show });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error fetching show", error: error.message });
  }
};

export const updateShow = async (req, res) => {
  try {
    const show = await Show.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!show) {
      return res.status(404).json({ success: false, message: "Show not found" });
    }
    res.status(200).json({ success: true, show });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error updating show", error: error.message });
  }
};

export const deleteShow = async (req, res) => {
  try {
    const show = await Show.findByIdAndDelete(req.params.id);
    if (!show) {
      return res.status(404).json({ success: false, message: "Show not found" });
    }
    res.status(200).json({ success: true, message: "Show deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error deleting show", error: error.message });
  }
};

export const getShowSeats = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id).select("bookedSeats totalSeats price");
    if (!show) {
      return res.status(404).json({ success: false, message: "Show not found" });
    }
    res.status(200).json({
      success: true,
      bookedSeats: show.bookedSeats,
      totalSeats: show.totalSeats,
      price: show.price,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error fetching seats", error: error.message });
  }
};