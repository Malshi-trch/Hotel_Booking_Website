import { Link } from "react-router-dom";

export default function RoomCard({ room }) {
  return (
    <div className="room-card">
      <img
        src={room.imageUrl || "https://placehold.co/600x400?text=No+Image"}
        alt={room.name}
        onError={(e) => { e.target.src = "https://placehold.co/600x400?text=No+Image"; }}
      />
      <div className="room-card-body">
        <span className="badge">{room.type}</span>
        <h3>{room.name}</h3>
        <p>Sleeps up to {room.capacity}</p>
        <p className="price">${room.pricePerNight} <small>/ night</small></p>
        <Link to={`/rooms/${room._id}`} className="btn">View Details</Link>
      </div>
    </div>
  );
}