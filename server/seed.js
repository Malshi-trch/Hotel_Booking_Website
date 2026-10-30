const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

require("dotenv").config();
const mongoose = require("mongoose");
const Room = require("./models/Room");

const rooms = [
  { name: "Ocean View Suite", type: "Suite", pricePerNight: 250, capacity: 4,
    description: "Spacious suite with sea view",
    imageUrl: "https://placehold.co/600x400?text=Ocean+View+Suite",
    amenities: ["WiFi", "AC", "Balcony", "Breakfast"] },
  { name: "Cozy Garden Single", type: "Single", pricePerNight: 60, capacity: 1,
    description: "Quiet single room overlooking the garden",
    imageUrl: "https://placehold.co/600x400?text=Garden+Single",
    amenities: ["WiFi", "Fan"] },
  { name: "City Single", type: "Single", pricePerNight: 75, capacity: 1,
    description: "Compact room close to the city centre",
    imageUrl: "https://placehold.co/600x400?text=City+Single",
    amenities: ["WiFi", "AC", "TV"] },
  { name: "Classic Double", type: "Double", pricePerNight: 120, capacity: 2,
    description: "Comfortable double room with a queen bed",
    imageUrl: "https://placehold.co/600x400?text=Classic+Double",
    amenities: ["WiFi", "AC", "TV"] },
  { name: "Poolside Double", type: "Double", pricePerNight: 140, capacity: 2,
    description: "Double room with direct pool access",
    imageUrl: "https://placehold.co/600x400?text=Poolside+Double",
    amenities: ["WiFi", "AC", "Pool Access"] },
  { name: "Deluxe Double", type: "Double", pricePerNight: 150, capacity: 3,
    description: "Larger double room with a sofa bed",
    imageUrl: "https://placehold.co/600x400?text=Deluxe+Double",
    amenities: ["WiFi", "AC", "TV", "Mini Bar"] },
  { name: "Family Double", type: "Double", pricePerNight: 180, capacity: 4,
    description: "Spacious room for a small family",
    imageUrl: "https://placehold.co/600x400?text=Family+Double",
    amenities: ["WiFi", "AC", "TV", "Breakfast"] },
  { name: "Presidential Suite", type: "Suite", pricePerNight: 280, capacity: 4,
    description: "Luxury suite with a lounge and private balcony",
    imageUrl: "https://placehold.co/600x400?text=Presidential+Suite",
    amenities: ["WiFi", "AC", "Balcony", "Breakfast", "Bathtub"] },
  { name: "Executive Suite", type: "Suite", pricePerNight: 300, capacity: 5,
    description: "Our largest suite with two bedrooms",
    imageUrl: "https://placehold.co/600x400?text=Executive+Suite",
    amenities: ["WiFi", "AC", "Kitchenette", "Breakfast", "Balcony"] },
];

const images = {
  Single: "/images/single.jpg",
  Double: "/images/double.jpg",
  Suite: "/images/suite.jpg",
};

const roomImages = {
  "Cozy Garden Single": "/images/rooms/cozy-garden-single.jpg",
  "City Single": "/images/rooms/city-single.jpg",
  "Classic Double": "/images/rooms/classic-double.jpg",
  "Poolside Double": "/images/rooms/poolside-double.jpg",
  "Deluxe Double": "/images/rooms/deluxe-double.jpg",
  "Family Double": "/images/rooms/family-double.jpg",
  "Presidential Suite": "/images/rooms/presidential-suite.jpg",
  "Executive Suite": "/images/rooms/executive-suite.jpg",
  "Ocean View Suite": "/images/rooms/ocean-view-suite.jpg",
};

rooms.forEach((r) => {
  r.imageUrl = roomImages[r.name] || images[r.type];
});

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Room.deleteMany({});
    await Room.insertMany(rooms);
    console.log(`Seeded ${rooms.length} rooms`);
  } catch (err) {
    console.log(err);
  } finally {
    await mongoose.disconnect();
  }
};

seed();