const express = require("express");
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBooking,
  cancelBooking,
} = require("../controllers/bookingController");
const { protect, adminOnly } = require("../middleware/auth");

router.route("/").post(protect, createBooking).get(protect, adminOnly, getAllBookings);
router.get("/my", protect, getMyBookings);
router.route("/:id").put(protect, updateBooking).delete(protect, cancelBooking);

module.exports = router;