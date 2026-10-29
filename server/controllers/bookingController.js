const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Room = require("../models/Room");

const DAY = 24 * 60 * 60 * 1000;
const ROOM_FIELDS = "name type imageUrl pricePerNight capacity";

const parseDate = (value) => {
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
};

const startOfToday = () => {
  const t = new Date();
  t.setUTCHours(0, 0, 0, 0);
  return t;
};

// Reloads a booking with its room details filled in
const withRoom = (id) => Booking.findById(id).populate("room", ROOM_FIELDS);

// Checks everything about a booking and works out the price.
// Returns { error, status } if something is wrong, otherwise the clean values.
const validateBooking = async ({ roomId, checkIn, checkOut, guests, excludeId, checkPast }) => {
  const inDate = parseDate(checkIn);
  const outDate = parseDate(checkOut);

  if (!inDate || !outDate) {
    return { error: "Valid check-in and check-out dates are required" };
  }
  if (outDate <= inDate) {
    return { error: "Check-out must be after check-in" };
  }
  if (checkPast && inDate < startOfToday()) {
    return { error: "Check-in cannot be in the past" };
  }

  const guestCount = Number(guests);
  if (!Number.isInteger(guestCount) || guestCount < 1) {
    return { error: "Guests must be a whole number of at least 1" };
  }

  if (!mongoose.Types.ObjectId.isValid(roomId)) {
    return { error: "Room not found", status: 404 };
  }
  const room = await Room.findById(roomId);
  if (!room) return { error: "Room not found", status: 404 };
  if (!room.isAvailable) return { error: "This room is not available for booking" };
  if (guestCount > room.capacity) {
    return { error: `This room sleeps up to ${room.capacity} guests` };
  }

  // OVERLAP CHECK: two stays clash when each one starts before the other ends.
  const overlapQuery = {
    room: room._id,
    status: "confirmed",
    checkIn: { $lt: outDate },
    checkOut: { $gt: inDate },
  };
  if (excludeId) overlapQuery._id = { $ne: excludeId };

  const clash = await Booking.findOne(overlapQuery);
  if (clash) return { error: "This room is already booked for those dates" };

  const nights = Math.ceil((outDate - inDate) / DAY);
  return {
    room,
    inDate,
    outDate,
    guestCount,
    totalPrice: nights * room.pricePerNight,
  };
};

// CREATE
exports.createBooking = async (req, res) => {
  try {
    const { room, checkIn, checkOut, guests } = req.body;

    const result = await validateBooking({
      roomId: room,
      checkIn,
      checkOut,
      guests,
      checkPast: true,
    });
    if (result.error) {
      return res.status(result.status || 400).json({ message: result.error });
    }

    const booking = await Booking.create({
      user: req.user._id,
      room: result.room._id,
      checkIn: result.inDate,
      checkOut: result.outDate,
      guests: result.guestCount,
      totalPrice: result.totalPrice,
    });

    res.status(201).json(await withRoom(booking._id));
  } catch (err) {
    console.error("createBooking error:", err);
    res.status(500).json({ message: err.message });
  }
};

// READ: my bookings
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("room", ROOM_FIELDS)
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error("getMyBookings error:", err);
    res.status(500).json({ message: err.message });
  }
};

// READ: all bookings (admin)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("room", ROOM_FIELDS)
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error("getAllBookings error:", err);
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
exports.updateBooking = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Booking not found" });
    }
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const isOwner = booking.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "You cannot edit this booking" });
    }
    if (booking.status === "cancelled" && !isAdmin) {
      return res.status(400).json({ message: "Cancelled bookings cannot be edited" });
    }

    const checkIn = req.body.checkIn || booking.checkIn;
    const checkOut = req.body.checkOut || booking.checkOut;
    const guests = req.body.guests || booking.guests;
    const datesChanged =
      req.body.checkIn &&
      new Date(req.body.checkIn).getTime() !== booking.checkIn.getTime();

    const result = await validateBooking({
      roomId: booking.room,
      checkIn,
      checkOut,
      guests,
      excludeId: booking._id,
      checkPast: datesChanged,
    });
    if (result.error) {
      return res.status(result.status || 400).json({ message: result.error });
    }

    booking.checkIn = result.inDate;
    booking.checkOut = result.outDate;
    booking.guests = result.guestCount;
    booking.totalPrice = result.totalPrice;

    // only an admin may change the status here
    if (isAdmin && ["confirmed", "cancelled"].includes(req.body.status)) {
      booking.status = req.body.status;
    }

    await booking.save();
    res.json(await withRoom(booking._id));
  } catch (err) {
    console.error("updateBooking error:", err);
    res.status(500).json({ message: err.message });
  }
};

// DELETE (cancel): the record is kept, its status becomes "cancelled"
exports.cancelBooking = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Booking not found" });
    }
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const isOwner = booking.user.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "You cannot cancel this booking" });
    }
    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking is already cancelled" });
    }

    booking.status = "cancelled";
    await booking.save();
    res.json({ message: "Booking cancelled", booking });
  } catch (err) {
    console.error("cancelBooking error:", err);
    res.status(500).json({ message: err.message });
  }
};