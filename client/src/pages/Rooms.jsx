import { useEffect, useState } from "react";
import api from "../services/api";
import RoomCard from "../components/RoomCard";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data } = await api.get("/rooms");
        setRooms(data);
      } catch (err) {
        setError("Could not load rooms. Is the server running?");
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  if (loading) return <p>Loading rooms...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <section>
      <h2>Our Rooms</h2>
      {rooms.length === 0 ? (
        <p>No rooms found.</p>
      ) : (
        <div className="room-grid">
          {rooms.map((room) => (
            <RoomCard key={room._id} room={room} />
          ))}
        </div>
      )}
    </section>
  );
}