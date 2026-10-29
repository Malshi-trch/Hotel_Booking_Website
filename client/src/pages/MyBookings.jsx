import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../services/api";

const toInput = (d) => new Date(d).toISOString().slice(0, 10);
const show = (d) =>
  new Date(d).toLocaleDateString("en-GB", { timeZone: "UTC" });

export default function MyBookings() {
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(location.state?.message || "");

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ checkIn: "", checkOut: "", guests: 1 });
  const [editError, setEditError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await api.get("/bookings/my");
        setBookings(data);
      } catch (err) {
        setError("Could not load your bookings.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const startEdit = (b) => {
    setMessage("");
    setEditError("");
    setEditingId(b._id);
    setEditForm({
      checkIn: toInput(b.checkIn),
      checkOut: toInput(b.checkOut),
      guests: b.guests,
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const saveEdit = async (b) => {
    setEditError("");
    if (!editForm.checkIn || !editForm.checkOut) {
      return setEditError("Please choose both dates.");
    }
    if (editForm.checkOut <= editForm.checkIn) {
      return setEditError("Check-out must be after check-in.");
    }
    const guests = Number(editForm.guests);
    if (!Number.isInteger(guests) || guests < 1 || guests > b.room.capacity) {
      return setEditError(`Guests must be between 1 and ${b.room.capacity}.`);
    }

    try {
      const { data } = await api.put(`/bookings/${b._id}`, {
        checkIn: editForm.checkIn,
        checkOut: editForm.checkOut,
        guests,
      });
      setBookings(bookings.map((x) => (x._id === b._id ? data : x)));
      setEditingId(null);
      setMessage("Booking updated.");
    } catch (err) {
      setEditError(err.response?.data?.message || "Could not update the booking.");
    }
  };

  const cancelBooking = async (b) => {
    if (!window.confirm(`Cancel your booking for ${b.room.name}?`)) return;
    try {
      await api.delete(`/bookings/${b._id}`);
      setBookings(
        bookings.map((x) => (x._id === b._id ? { ...x, status: "cancelled" } : x))
      );
      setMessage("Booking cancelled.");
    } catch (err) {
      setError(err.response?.data?.message || "Could not cancel the booking.");
    }
  };

  if (loading) return <p>Loading your bookings...</p>;

  return (
    <section>
      <h2>My Bookings</h2>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}

      {bookings.length === 0 && !error ? (
        <p>
          You have no bookings yet. <Link to="/rooms">Browse rooms</Link>
        </p>
      ) : (
        <div className="booking-list">
          {bookings.map((b) => (
            <div className="booking-item" key={b._id}>
              <div className="booking-info">
                <h3>{b.room?.name || "Room removed"}</h3>
                <span className={`status status-${b.status}`}>{b.status}</span>
                <p>
                  {show(b.checkIn)} &rarr; {show(b.checkOut)}
                </p>
                <p>
                  {b.guests} {b.guests === 1 ? "guest" : "guests"} &middot; Total{" "}
                  <strong>${b.totalPrice}</strong>
                </p>
              </div>

{b.status === "confirmed" && b.room && editingId !== b._id && (                <div className="booking-actions">
                  <button className="btn" onClick={() => startEdit(b)}>Edit</button>
                  <button className="btn btn-danger" onClick={() => cancelBooking(b)}>
                    Cancel
                  </button>
                </div>
              )}

              {editingId === b._id && (
                <div className="booking-edit">
                  {editError && <p className="error">{editError}</p>}
                  <label>Check-in</label>
                  <input type="date" name="checkIn" value={editForm.checkIn} onChange={handleEditChange} />
                  <label>Check-out</label>
                  <input
                    type="date"
                    name="checkOut"
                    min={editForm.checkIn}
                    value={editForm.checkOut}
                    onChange={handleEditChange}
                  />
                  <label>Guests (max {b.room.capacity})</label>
                  <input
                    type="number"
                    name="guests"
                    min="1"
                    max={b.room.capacity}
                    value={editForm.guests}
                    onChange={handleEditChange}
                  />
                  <div className="booking-actions">
                    <button className="btn" onClick={() => saveEdit(b)}>Save</button>
                    <button className="btn btn-secondary" onClick={() => setEditingId(null)}>
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}