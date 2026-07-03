import Theatre from "../models/Theatre.js";

export const createTheatre = async (req, res) => {
  try {
    const theatre = await Theatre.create(req.body);
    res.status(201).json({ success: true, theatre });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error creating theatre", error: error.message });
  }
};

export const getTheatres = async (req, res) => {
  try {
    const { city } = req.query;
    const filter = { isActive: true };
    if (city) filter.city = city;

    const theatres = await Theatre.find(filter);
    res.status(200).json({ success: true, count: theatres.length, theatres });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error fetching theatres", error: error.message });
  }
};

export const getTheatreById = async (req, res) => {
  try {
    const theatre = await Theatre.findById(req.params.id);
    if (!theatre) {
      return res.status(404).json({ success: false, message: "Theatre not found" });
    }
    res.status(200).json({ success: true, theatre });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error fetching theatre", error: error.message });
  }
};

export const updateTheatre = async (req, res) => {
  try {
    const theatre = await Theatre.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!theatre) {
      return res.status(404).json({ success: false, message: "Theatre not found" });
    }
    res.status(200).json({ success: true, theatre });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error updating theatre", error: error.message });
  }
};

export const deleteTheatre = async (req, res) => {
  try {
    const theatre = await Theatre.findByIdAndDelete(req.params.id);
    if (!theatre) {
      return res.status(404).json({ success: false, message: "Theatre not found" });
    }
    res.status(200).json({ success: true, message: "Theatre deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error deleting theatre", error: error.message });
  }
};