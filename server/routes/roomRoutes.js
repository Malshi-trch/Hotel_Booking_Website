const express = require("express");
const router = express.Router();
const {
  createRoom,
  getRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
} = require("../controllers/roomController");
const { protect, adminOnly } = require("../middleware/auth");

router.route("/").get(getRooms).post(protect, adminOnly, createRoom);
router
  .route("/:id")
  .get(getRoomById)
  .put(protect, adminOnly, updateRoom)
  .delete(protect, adminOnly, deleteRoom);

module.exports = router;