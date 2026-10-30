import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function AdminRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data } = await api.get("/rooms");
        setRooms(data);
      } catch {
        setError("Could not load rooms.");
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const handleDelete = async (room) => {
    if (!window.confirm(`Delete "${room.name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/rooms/${room._id}`);
      setRooms(rooms.filter((r) => r._id !== room._id));
      setMessage("Room deleted.");
      setError("");
    } catch {
      setError(err.response?.data?.message || "Could not delete the room.");
      setMessage("");
    }
  };

  if (loading) return <p>Loading rooms...</p>;

  return (
    <section>
      <div className="admin-header">
        <h2>Manage Rooms</h2>
        <Link to="/admin/rooms/new" className="btn">+ Add Room</Link>
      </div>

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}

      {rooms.length === 0 ? (
        <p>No rooms yet. Add the first one.</p>
      ) : (
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Price / night</th>
                <th>Capacity</th>
                <th>Available</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room._id}>
                  <td>{room.name}</td>
                  <td>{room.type}</td>
                  <td>${room.pricePerNight}</td>
                  <td>{room.capacity}</td>
                  <td>{room.isAvailable ? "Yes" : "No"}</td>
                  <td className="table-actions">
                    <Link to={`/admin/rooms/${room._id}/edit`} className="btn btn-small">
                      Edit
                    </Link>
                    <button className="btn btn-small btn-danger" onClick={() => handleDelete(room)}>
                      Delete
                    </button>
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