import { Link } from "react-router-dom";

const FALLBACK = "https://placehold.co/600x400?text=No+Image";

export default function RoomCard({ room }) {
  return (
    <div className="room-card">
      <img
        src={room.imageUrl || FALLBACK}
        alt={room.name}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = FALLBACK;
        }}
      />
      <div className="room-card-body">
        <span className="badge">{room.type}</span>
        <h3>{room.name}</h3>
        <p>
          Sleeps up to {room.capacity} {room.capacity === 1 ? "guest" : "guests"}
        </p>
        <div className="chips">
          {(room.amenities || []).slice(0, 3).map((a) => (
            <span className="chip" key={a}>{a}</span>
          ))}
        </div>
        <p className="price">
          ${room.pricePerNight} <small>/ night</small>
        </p>
        <Link to={`/rooms/${room._id}`} className="btn">View Details</Link>
      </div>
    </div>
  );
}