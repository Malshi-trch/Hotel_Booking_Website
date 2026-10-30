import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <section className="hero-banner">
        <h1>Find your perfect stay</h1>
        <p>Comfortable rooms, simple booking, clear prices.</p>
        <Link to="/rooms" className="btn">Browse Rooms</Link>
      </section>

      <section className="features">
        <div className="feature">
          <h3>Easy booking</h3>
          <p>Pick your dates and confirm in a few clicks.</p>
        </div>
        <div className="feature">
          <h3>Clear prices</h3>
          <p>See the total cost before you book.</p>
        </div>
        <div className="feature">
          <h3>Manage anytime</h3>
          <p>Edit or cancel your booking from your account.</p>
        </div>
      </section>
    </>
  );
}