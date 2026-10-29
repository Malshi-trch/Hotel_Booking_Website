import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="brand">Hotel Booking</Link>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/rooms">Rooms</Link>
        {user ? (
          <>
            {user.role === "admin" ? (
              <>
                <Link to="/admin/rooms">Manage Rooms</Link>
                <Link to="/admin/bookings">All Bookings</Link>
              </>
            ) : (
              <Link to="/my-bookings">My Bookings</Link>
            )}
            <span className="nav-user">
              {user.name}{user.role === "admin" ? " (admin)" : ""}
            </span>
            <button className="nav-btn" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}