import {Link} from "react-router-dom";

export default function Home() {
    return(
        <section className = "hero">
            <h1>Find your perfect stay </h1>
            <p>Browse our rooms and book in a few clicks.</p>
            <Link to= "/rooms" className="btn">Browse Rooms</Link>
        </section>
    );
}