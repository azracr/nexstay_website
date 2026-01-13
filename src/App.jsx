import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Header";
import Home from "./pages/Home";
import Results from "./pages/Results";
import HotelDetails from "./pages/HotelDetails";
import Checkout from "./pages/Checkout";
import Bookings from "./pages/MyBookings";
import Compare from "./pages/Compare";
import Login from "./pages/Login";

export default function App() {

  
  return (
    <div className="app">
      <Navbar />
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/results" element={<Results />} />
          <Route path="/hotel/:id" element={<HotelDetails />} />
          <Route path="/checkout/:id" element={<Checkout />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
