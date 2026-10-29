import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Rooms from "./pages/Rooms";
import RoomDetails from "./pages/RoomDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyBookings from "./pages/MyBookings";
import AdminRooms from "./pages/admin/AdminRooms";
import RoomForm from "./pages/admin/RoomForm";
import AdminBookings from "./pages/admin/AdminBookings";

function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/:id" element={<RoomDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/rooms"
            element={
              <ProtectedRoute adminOnly>
                <AdminRooms />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/rooms/new"
            element={
              <ProtectedRoute adminOnly>
                <RoomForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/rooms/:id/edit"
            element={
              <ProtectedRoute adminOnly>
                <RoomForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute adminOnly>
                <AdminBookings />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </>
  );
}

export default App;