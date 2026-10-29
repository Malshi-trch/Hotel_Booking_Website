import { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const FALLBACK = "https://placehold.co/600x400?text=No+Image";
const DAY = 24 * 60 * 60 * 1000;
const today = () => new Date().toISOString().slice(0, 10);

export default function RoomDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({ checkIn: "", checkOut: "", guests: 1 });
  const [bookingError, setBookingError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const { data } = await api.get(`/rooms/${id}`);
        setRoom(data);
      } catch {
        setError("Room not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id]);

  const nights =
    form.checkIn && form.checkOut
      ? Math.ceil((new Date(form.checkOut) - new Date(form.checkIn)) / DAY)
      : 0;
  const total = room && nights > 0 ? nights * room.pricePerNight : 0;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBook = async (e) => {
    e.preventDefault();
    setBookingError("");

    if (!form.checkIn || !form.checkOut) {
      return setBookingError("Please choose check-in and check-out dates.");
    }
    if (form.checkIn < today()) {
      return setBookingError("Check-in cannot be in the past.");
    }
    if (form.checkOut <= form.checkIn) {
      return setBookingError("Check-out must be after check-in.");
    }
    const guests = Number(form.guests);
    if (!Number.isInteger(guests) || guests < 1 || guests > room.capacity) {
      return setBookingError(`Guests must be between 1 and ${room.capacity}.`);
    }

    try {
      setSubmitting(true);
      await api.post("/bookings", {
        room: id,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        guests,
      });
      navigate("/my-bookings", { state: { message: "Booking confirmed!" } });
    } catch {
      setBookingError(err.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <section className="details">
      <Link to="/rooms">&larr; Back to rooms</Link>
      <img
        src={room.imageUrl || FALLBACK}
        alt={room.name}
        onError={(e) => { e.target.src = FALLBACK; }}
      />
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

      <div className="booking-box">
        <h3>Book this room</h3>

        {!room.isAvailable ? (
          <p className="error">This room is not available for booking.</p>
        ) : !user ? (
          <p>
            <Link to="/login" state={{ from: location }} className="btn">
              Log in to book
            </Link>
          </p>
        ) : (
          <form onSubmit={handleBook} className="booking-form">
            {bookingError && <p className="error">{bookingError}</p>}

            <label>Check-in</label>
            <input
              type="date"
              name="checkIn"
              min={today()}
              value={form.checkIn}
              onChange={handleChange}
            />

            <label>Check-out</label>
            <input
              type="date"
              name="checkOut"
              min={form.checkIn || today()}
              value={form.checkOut}
              onChange={handleChange}
            />

            <label>Guests (max {room.capacity})</label>
            <input
              type="number"
              name="guests"
              min="1"
              max={room.capacity}
              value={form.guests}
              onChange={handleChange}
            />

            {nights > 0 && (
              <p className="total">
                {nights} {nights === 1 ? "night" : "nights"} &times; ${room.pricePerNight} ={" "}
                <strong>${total}</strong>
              </p>
            )}

            <button className="btn" type="submit" disabled={submitting}>
              {submitting ? "Booking..." : "Confirm booking"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}