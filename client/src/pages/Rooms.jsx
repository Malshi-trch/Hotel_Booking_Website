import { useEffect, useState } from "react";
import api from "../services/api";
import RoomCard from "../components/RoomCard";

const initialFilters = {
  search: "",
  type: "",
  minPrice: "",
  maxPrice: "",
  capacity: "",
  sort: "",
};

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const priceInvalid =
    filters.minPrice !== "" &&
    filters.maxPrice !== "" &&
    Number(filters.minPrice) > Number(filters.maxPrice);

  useEffect(() => {
    if (priceInvalid) return;

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const params = {};
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== "") params[key] = value;
        });
        const { data } = await api.get("/rooms", { params });
        setRooms(data);
        setError("");
      } catch {
        setError("Could not load rooms. Is the server running?");
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [filters, priceInvalid]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleReset = () => setFilters(initialFilters);

  return (
    <section>
      <h2>Our Rooms</h2>

      <div className="filters">
        <input
          type="text"
          name="search"
          placeholder="Search by room name..."
          value={filters.search}
          onChange={handleChange}
        />

        <select name="type" value={filters.type} onChange={handleChange}>
          <option value="">All types</option>
          <option value="Single">Single</option>
          <option value="Double">Double</option>
          <option value="Suite">Suite</option>
        </select>

        <input
          type="number"
          name="minPrice"
          placeholder="Min price"
          min="0"
          value={filters.minPrice}
          onChange={handleChange}
        />

        <input
          type="number"
          name="maxPrice"
          placeholder="Max price"
          min="0"
          value={filters.maxPrice}
          onChange={handleChange}
        />

        <select name="capacity" value={filters.capacity} onChange={handleChange}>
          <option value="">Any guests</option>
          <option value="1">1+ guests</option>
          <option value="2">2+ guests</option>
          <option value="3">3+ guests</option>
          <option value="4">4+ guests</option>
          <option value="5">5+ guests</option>
        </select>

        <select name="sort" value={filters.sort} onChange={handleChange}>
          <option value="">Newest first</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
        </select>

        <button className="btn btn-secondary" onClick={handleReset}>
          Reset
        </button>
      </div>

      {priceInvalid && (
        <p className="error">Minimum price cannot be higher than maximum price.</p>
      )}

      {loading && <p>Loading rooms...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && !priceInvalid && (
        <>
          <p className="result-count">
            {rooms.length} {rooms.length === 1 ? "room" : "rooms"} found
          </p>
          {rooms.length === 0 ? (
            <p>No rooms match your filters. Try changing or resetting them.</p>
          ) : (
            <div className="room-grid">
              {rooms.map((room) => (
                <RoomCard key={room._id} room={room} />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}