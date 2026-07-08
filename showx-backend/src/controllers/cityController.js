import City from "../models/City.js";

export const getCities = async (req, res) => {
  try {
    const cities = await City.find({ isActive: true }).sort({ name: 1 });
    res.status(200).json({ success: true, count: cities.length, cities });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error fetching cities", error: error.message });
  }
};

export const createCity = async (req, res) => {
  try {
    const { name, state, latitude, longitude } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "City name is required" });
    }

    const existing = await City.findOne({ name: new RegExp(`^${name}$`, "i") });
    if (existing) {
      return res.status(400).json({ success: false, message: "This city already exists" });
    }

    const city = await City.create({ name, state, latitude, longitude });
    res.status(201).json({ success: true, message: "City added successfully", city });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error creating city", error: error.message });
  }
};

export const deleteCity = async (req, res) => {
  try {
    const city = await City.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!city) {
      return res.status(404).json({ success: false, message: "City not found" });
    }
    res.status(200).json({ success: true, message: "City removed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error deleting city", error: error.message });
  }
};