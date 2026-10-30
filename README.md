# Hotel Booking Website (MERN Full-Stack Development)

## EC4307 Web Application Development
**Name**: Weerasinghe W.B.M.M.N.

**Reg. No**: EG/2023/5958

**Github Repository**: https://github.com/Malshi-trch/Hotel_Booking_Website


## Overview

A full-stack hotel booking web application built with the **MERN stack** (MongoDB, Express, React, Node.js). Guests can browse rooms, search, filter and sort them as their requirments, register, log in and manage their own bookings. The hotel owner (admin) can manage rooms and see and manage every booking.

## Features

### Guests (visitors and registered users)

Browse all rooms without logging in

Search by name, filter by type, price range and capacity, and sort by price

View room details (images, description, amenities, price)

Register and log in (passwords are hashed, sessions use JWT)

Create a booking with a live price preview

Read their own bookings on the My Bookings page

Update a booking (dates and number of guests)

Delete (cancel) a booking with a confirmation dialog

Double bookings are prevented by a date overlap check

### Admin (hotel owner)

Create and update rooms with a form

Delete rooms (blocked while a room has upcoming bookings)

View all bookings with guest details, filter by status

Cancel or restore any booking

Admin pages are protected on both the client and the server

## Tech stack

|**Layer** | **Tools**|
|--|--|
|Frontend|	React (Vite), React Router, Axios|
|Backend| Node.js, Express, Mongoose|
|Database| MongoDB Atlas|
|Security| bcryptjs (password hashing), jsonwebtoken (JWT), role-based access (guest / admin)|
|Tools|	Git and GitHub, VS Code, REST Client (API testing)|

## Project structure

    Hotel_Booking_Website/
     client/                    React frontend (Vite)
        public/images/          Room and banner photos
        src/
        App.jsx, main.jsx, index.css
        components/             Navbar, Footer, RoomCard, ProtectedRoute
        context/                AuthContext (login state)
        pages/                  Home, Rooms, RoomDetails, Login, Register,
                                MyBookings, NotFound
        pages/admin/            AdminRooms, RoomForm, AdminBookings
        services/api.js         Axios instance (adds the token automatically)
        index.html, package.json, vite.config.js
     server/                    Express backend
        models/                 User, Room, Booking
        controllers/            authController, roomController, bookingController
        routes/                 authRoutes, roomRoutes, bookingRoutes
        middleware/             auth (protect, adminOnly), errorHandler
        server.js               App entry point (Express setup and MongoDB connection)
        seed.js                 Loads sample rooms
        resetBookings.js        Deletes all bookings (testing only)
        requests.http           API test requests
        package.json
     docs/                      ERD and screenshots
     .gitignore
     README.md

## Database design

The ERD is in docs/erd.png.

|**Collection**| **Main Fields**|
|--|--|
|User| 	name, email (unique), password (hashed), role (guest / admin)|
|Room| name, type (Single / Double / Suite), pricePerNight, capacity, description, imageUrl, amenities, isAvailable|
|Booking| user (ref User), room (ref Room), checkIn, checkOut, guests, totalPrice, status (confirmed / cancelled)|


Relationships: one User has many Bookings, and one Room has many Bookings. A booking belongs to exactly one user and one room.

## Getting started

### Prerequisites

-Node.js (LTS) and npm
-Github
-A free MongoDB Atlas cluster

### 1. Clone the repository

git clone https://github.com/Malshi-trch/Hotel_Booking_Website
cd Hotel_Booking_Website

### 2. MongoDB Atlas setup

1. Create a free M0 cluster.
2. Under Database Access, create a user with a username and password
3. Under Network Access, allow access from anywhere (0.0.0.0/0).
4. Click Connect > Drivers and copy the connection string.

### 3. Configure the backend

Create server/.env with these values:

    PORT=5000
    MONGO_URI=mongodb+srv://USERNAME:PASSWORD@YOUR-CLUSTER.mongodb.net/hotel_booking?retryWrites=true&w=majority
    JWT_SECRET=a_long_random_string

The .env file is ignored by Git and must never be committed.

### 4. Install and run the backend

    cd server
    npm install
    npm run seed
    npm run dev

The terminal should print "MongoDB connected" and "Server on port 5000".

### 5. Install and run the frontend

Open a second terminal:

    cd client
    npm install
    npm run dev

Open the address it prints (usually http://localhost:5173).

## Available scripts (server)

|**Command**| **What it does**|
|--|--|
|npm run dev| Starts the API with nodemon (auto restart)|
|npm run seed| Deletes all rooms and loads 9 sample rooms|
| npm run reset:bookings| Deletes all bookings (for testing only)|

## Creating an admin account

For safety, no page or API can create an admin.

1. Register a normal account on the Register page. Every new account is a guest.
2. In MongoDB Atlas, open Browse Collections > hotel_booking > users, edit that user, and change role from "guest" to "admin".
3. Log out and log in again. The navbar now shows Manage Rooms and All Bookings.

## API endpoints

|Method| Endpoint| Access|
|--|--|--|
|POST| /api/auth/register, /api/auth/login| Public|
|GET| /api/auth/me| Logged in|
|GET| /api/rooms (query: type, minPrice, maxPrice, capacity, search, sort) | Public
|GET| /api/rooms/:id| Public
|POST/PUT/DELETE| /api/rooms, /api/rooms/:id| Admin|
|POST| /api/bookings| Logged in|
|GET| /api/bookings/my| Logged in|
|GET| /api/bookings| Admin
|PUT|DELETE| /api/bookings/:id| Owner or admin

## Validation and error handling

- **Client side**: form checks for empty fields, email format, password length and match, date order, guest limits and price values, with clear messages.
- **Server side**: Mongoose schema rules (required, enum, min), checks for dates, guests and room capacity, and an overlap check for bookings.
- **Central error handler**: consistent JSON error messages, a 404 handler for unknown routes, and no stack traces sent to users.
- **Security**: hashed passwords, JWT authentication, role checks on the server, and automatic logout when a token expires.
- **Pages**: a 404 page, loading and empty states, and friendly messages when the server is unreachable.

## Testing

The API was tested with the REST Client extension in VS Code. The request files are in server/requests.http (placeholders for tokens). Cases covered:

- Create, read, update and delete for rooms and bookings
- Overlapping dates rejected, and back-to-back stays allowed
- Past dates, check-out before check-in and too many guests rejected
- No token (401) and guest trying an admin action (403)
- Wrong password, duplicate email and invalid input

The user interface was tested manually, including a phone-width layout.

## Screenshots

### Home

![Home page](docs/screenshots/01-home.png)

### Rooms with search, filters and sorting
![Rooms](docs/screenshots/02-rooms.png)

### Room details and booking form
![Room details](docs/screenshots/03-room-details.png)

### Register
![Register](docs/screenshots/04-register.png)

### Login
![Login](docs/screenshots/05-login.png)

### My Bookings
![My Bookings](docs/screenshots/06-my-bookings.png)

### Admin: Manage Rooms
![Manage Rooms](docs/screenshots/07-admin-rooms.png)

### Admin: Add Room form
![Add Room form](docs/screenshots/08-room-form.png)

### Admin: All Bookings
![All Bookings](docs/screenshots/09-admin-booking.png)

### Validation message
![Validation message](docs/screenshots/10-error-message.png)

## Troubleshooting

-** querySrv ECONNREFUSED when starting the server**: a DNS problem on some networks. server/server.js already sets public DNS servers at the top of the file. If it persists, try another network such as a phone hotspot.
-** Login works but you are logged out on refresh**: check that the browser allows local storage.
- **"This room is already booked for those dates"**: choose other dates, or run npm run reset:bookings while testing.


## Future improvements

- Online p,yments and email confirmations
- Multiple hotels, each with its own owner account
- Room availability calendar and reviews
  
## Credits

Room and banner photos are from https://unsplash.com/