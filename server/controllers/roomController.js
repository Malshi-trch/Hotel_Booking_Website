const mongoose = require("mongoose");
const Room = require("../models/Room");

//create
exports.createRoom = async (req, res) => {
    try {
        const room = await Room.create(req.body);
        res.status(201).json(room);
    } catch (err) {
        res.status(400).json({message: err.message });
    }    
};

// READ all (with search, filter, sort)
exports.getRooms = async (req, res) => {
  try {
    const { type, minPrice, maxPrice, capacity, search, sort } = req.query;
    const filter = {};

    if (type) filter.type = type;
    if (capacity) filter.capacity = { $gte: Number(capacity) };
    if (minPrice || maxPrice) {
      filter.pricePerNight = {};
      if (minPrice) filter.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerNight.$lte = Number(maxPrice);
    }
    if (search) filter.name = { $regex: search, $options: "i" };

    let sortOption = { createdAt: -1 };
    if (sort === "price_asc") sortOption = { pricePerNight: 1 };
    if (sort === "price_desc") sortOption = { pricePerNight: -1 };

    const rooms = await Room.find(filter).sort(sortOption);
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ one
exports.getRoomById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Room not found" });
    }
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
exports.updateRoom = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Room not found" });
    }
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json(room);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE
exports.deleteRoom = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Room not found" });
    }
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json({ message: "Room deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};