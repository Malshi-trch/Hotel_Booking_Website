import { Link } from "react-router-dom";

export default function RoomCard({ room }) {
  return (
    <div className="room-card">
      <img src={room.imageUrl} alt={room.name} />
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