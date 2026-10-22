import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

export default function RoomDetails() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const { data } = await api.get(`/rooms/${id}`);
        setRoom(data);
      } catch (err) {
        setError("Room not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <section className="details">
      <Link to="/rooms">&larr; Back to rooms</Link>
      <img src={room.imageUrl} alt={room.name} />
      <h2>{room.name}</h2>
      <span className="badge">{room.type}</span>
      <p>{room.description}</p>
      <p>Capacity: {room.capacity} guests</p>
      <p className="price">${room.pricePerNight} <small>/ night</small></p>
      <h4>Amenities</h4>
      <ul>
        {room.amenities.map((a) => (
          <li key={a}>{a}</li>
        ))}
      </ul>
    </section>
  );
}