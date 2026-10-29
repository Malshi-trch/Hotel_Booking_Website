import { useEffect, useState } from "react";
import api from "../../services/api";

const show = (d) => new Date(d).toLocaleDateString("en-GB", { timeZone: "UTC" });

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await api.get("/bookings");
        setBookings(data);
      } catch {
        setError("Could not load bookings.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const replace = (updated) =>
    setBookings(bookings.map((b) => (b._id === updated._id ? { ...b, ...updated } : b)));

  const cancelBooking = async (b) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await api.delete(`/bookings/${b._id}`);
      replace({ _id: b._id, status: "cancelled" });
      setMessage("Booking cancelled.");
      setError("");
    } catch {
      setError(err.response?.data?.message || "Could not cancel the booking.");
      setMessage("");
    }
  };

  const restoreBooking = async (b) => {
    try {
      await api.put(`/bookings/${b._id}`, { status: "confirmed" });
      replace({ _id: b._id, status: "confirmed" });
      setMessage("Booking restored.");
      setError("");
    } catch {
      setError(err.response?.data?.message || "Could not restore the booking.");
      setMessage("");
    }
  };

  const visible = statusFilter
    ? bookings.filter((b) => b.status === statusFilter)
    : bookings;

  if (loading) return <p>Loading bookings...</p>;

  return (
    <section>
      <div className="admin-header">
        <h2>All Bookings</h2>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
      <p className="result-count">{visible.length} bookings</p>

      {visible.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Guest</th>
                <th>Room</th>
                <th>Dates</th>
                <th>Guests</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((b) => (
                <tr key={b._id}>
                  <td>
                    {b.user?.name || "Deleted user"}
                    <br />
                    <small>{b.user?.email}</small>
                  </td>
                  <td>{b.room?.name || "Room removed"}</td>
                  <td>
                    {show(b.checkIn)} &rarr; {show(b.checkOut)}
                  </td>
                  <td>{b.guests}</td>
                  <td>${b.totalPrice}</td>
                  <td>
                    <span className={`status status-${b.status}`}>{b.status}</span>
                  </td>
                  <td className="table-actions">
                    {b.status === "confirmed" ? (
                      <button className="btn btn-small btn-danger" onClick={() => cancelBooking(b)}>
                        Cancel
                      </button>
                    ) : (
                      <button className="btn btn-small" onClick={() => restoreBooking(b)}>
                        Restore
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}