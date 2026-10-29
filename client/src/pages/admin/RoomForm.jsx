import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../../services/api";

const empty = {
  name: "",
  type: "Single",
  pricePerNight: "",
  capacity: "",
  description: "",
  imageUrl: "",
  amenities: "",
  isAvailable: true,
};

export default function RoomForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    const fetchRoom = async () => {
      try {
        const { data } = await api.get(`/rooms/${id}`);
        setForm({
          name: data.name,
          type: data.type,
          pricePerNight: data.pricePerNight,
          capacity: data.capacity,
          description: data.description || "",
          imageUrl: data.imageUrl || "",
          amenities: (data.amenities || []).join(", "),
          isAvailable: data.isAvailable,
        });
      } catch {
        setError("Room not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) return setError("Room name is required.");
    if (form.pricePerNight === "" || Number(form.pricePerNight) <= 0) {
      return setError("Price per night must be greater than 0.");
    }
    const capacity = Number(form.capacity);
    if (!Number.isInteger(capacity) || capacity < 1) {
      return setError("Capacity must be a whole number of at least 1.");
    }

    const payload = {
      name: form.name.trim(),
      type: form.type,
      pricePerNight: Number(form.pricePerNight),
      capacity,
      description: form.description.trim(),
      imageUrl: form.imageUrl.trim(),
      amenities: form.amenities
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
      isAvailable: form.isAvailable,
    };

    try {
      setSubmitting(true);
      if (isEdit) {
        await api.put(`/rooms/${id}`, payload);
      } else {
        await api.post("/rooms", payload);
      }
      navigate("/admin/rooms");
    } catch {
      setError(err.response?.data?.message || "Could not save the room.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <section className="form-card wide">
      <Link to="/admin/rooms">&larr; Back to rooms</Link>
      <h2>{isEdit ? "Edit Room" : "Add Room"}</h2>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input name="name" value={form.name} onChange={handleChange} />

        <label>Type</label>
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="Single">Single</option>
          <option value="Double">Double</option>
          <option value="Suite">Suite</option>
        </select>

        <label>Price per night ($)</label>
        <input
          type="number"
          name="pricePerNight"
          min="0"
          value={form.pricePerNight}
          onChange={handleChange}
        />

        <label>Capacity (guests)</label>
        <input
          type="number"
          name="capacity"
          min="1"
          value={form.capacity}
          onChange={handleChange}
        />

        <label>Description</label>
        <textarea
          name="description"
          rows="3"
          value={form.description}
          onChange={handleChange}
        />

        <label>Image URL</label>
        <input name="imageUrl" value={form.imageUrl} onChange={handleChange} />

        <label>Amenities (separate with commas)</label>
        <input
          name="amenities"
          placeholder="WiFi, AC, Breakfast"
          value={form.amenities}
          onChange={handleChange}
        />

        <label className="check-row">
          <input
            type="checkbox"
            name="isAvailable"
            checked={form.isAvailable}
            onChange={handleChange}
          />
          Available for booking
        </label>

        <button className="btn" type="submit" disabled={submitting}>
          {submitting ? "Saving..." : isEdit ? "Save changes" : "Add room"}
        </button>
      </form>
    </section>
  );
}
