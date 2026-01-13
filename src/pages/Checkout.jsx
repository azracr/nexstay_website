import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { addBooking } from "../utils/storage";

export default function Checkout() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [checkIn, setCheckIn] = useState(searchParams.get("checkIn") || "");
  const [checkOut, setCheckOut] = useState(searchParams.get("checkOut") || "");
  const [guests, setGuests] = useState(searchParams.get("guests") || "2");

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("Standard");

  useEffect(() => {
    fetch("/hotels.json")
      .then((r) => r.json())
      .then((d) => setHotels(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, []);

  const hotel = useMemo(
    () => hotels.find((h) => String(h.id) === String(id)),
    [hotels, id]
  );

  const toDate = (s) => {
    if (!s) return null;
    const d = new Date(`${s}T00:00:00`);
    return Number.isNaN(d.getTime()) ? null : d;
  };

  const dateError = useMemo(() => {
    if (!checkIn || !checkOut) return "Please select check-in and check-out dates.";
    const inD = toDate(checkIn);
    const outD = toDate(checkOut);
    if (!inD || !outD) return "Invalid date format.";
    if (outD <= inD) return "Check-out date must be after check-in date.";
    return "";
  }, [checkIn, checkOut]);

  const nights = useMemo(() => {
    const inD = toDate(checkIn);
    const outD = toDate(checkOut);
    if (!inD || !outD) return 0;
    const diffMs = outD.getTime() - inD.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }, [checkIn, checkOut]);

  const roomMultiplier = useMemo(() => {
    if (room === "Deluxe") return 1.15;
    if (room === "Suite") return 1.3;
    return 1.0;
  }, [room]);

  const guestsMultiplier = useMemo(() => {
    const g = Math.max(1, Number(guests) || 1);
    if (g === 1) return 0.95;
    if (g === 2) return 1.0;
    if (g === 3) return 1.12;
    if (g === 4) return 1.22;
    return 1.3;
  }, [guests]);

  const perNight = useMemo(() => {
    const base = hotel?.price ?? 0;
    const v = base * roomMultiplier * guestsMultiplier;
    return Math.round(v);
  }, [hotel, roomMultiplier, guestsMultiplier]);

  const total = useMemo(() => {
    if (!nights) return perNight;
    return perNight * nights;
  }, [perNight, nights]);

  const submit = (e) => {
    e.preventDefault();
    if (!hotel) return;
    if (dateError) {
      alert(dateError);
      return;
    }

    const booking = {
      id: String(Date.now()),
      hotelId: String(hotel.id),
      hotelName: hotel.name,
      image: hotel.image,
      city: hotel.city,
      area: hotel.area || "",
      guests: String(guests),
      checkIn,
      checkOut,
      nights,
      room,
      basePrice: hotel.price,
      perNight,
      totalPrice: total,
      status: "upcoming",
      createdAt: new Date().toISOString(),
    };

    addBooking(booking);
    navigate("/bookings");
  };

  if (loading) return <div className="container">Loading...</div>;
  if (!hotel) return <div className="container">Hotel not found.</div>;

  return (
    <div className="container">
      <h2 style={{ marginTop: 0 }}>Checkout</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 18, alignItems: "start" }}>
        <form className="card" style={{ padding: 16 }} onSubmit={submit}>
          <div style={{ fontWeight: 900, marginBottom: 10 }}>Guest Details</div>

          {dateError ? (
            <div className="card soft" style={{ padding: 12, border: "1px solid #fee2e2", marginBottom: 12 }}>
              <div style={{ fontWeight: 800 }}>Dates required</div>
              <div className="muted" style={{ marginTop: 6 }}>{dateError}</div>
            </div>
          ) : null}

          <div style={{ display: "grid", gap: 10 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <div className="muted" style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Check-in</div>
                <input className="input" type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} required />
              </div>
              <div>
                <div className="muted" style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Check-out</div>
                <input className="input" type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} required />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <div className="muted" style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Guests</div>
                <input
                  className="input"
                  type="number"
                  min={1}
                  max={10}
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  required
                />
              </div>

              <div>
                <div className="muted" style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Room Type</div>
                <select className="select" value={room} onChange={(e) => setRoom(e.target.value)}>
                  <option value="Standard">Standard</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Suite">Suite</option>
                </select>
              </div>
            </div>

            <div>
              <div className="muted" style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Full Name</div>
              <input className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>

            <div>
              <div className="muted" style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Email</div>
              <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>

          <div className="hr" />

          <button className="btn" type="submit">Confirm Booking</button>
        </form>

        <aside className="card" style={{ padding: 16 }}>
          <div style={{ fontWeight: 900, marginBottom: 10 }}>Summary</div>

          <div style={{ display: "grid", gap: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "90px 1fr", gap: 10 }}>
              <img src={hotel.image} alt={hotel.name} style={{ width: 90, height: 70, objectFit: "cover", borderRadius: 12 }} />
              <div>
                <div style={{ fontWeight: 900 }}>{hotel.name}</div>
                <div className="muted" style={{ marginTop: 4 }}>
                  {hotel.city}{hotel.area ? ` • ${hotel.area}` : ""} • {hotel.category}
                </div>
                <div className="muted" style={{ marginTop: 6 }}>
                  {checkIn && checkOut ? `${checkIn} → ${checkOut}` : "Dates: -"}
                  {nights ? ` • Nights: ${nights}` : ""}
                  {guests ? ` • Guests: ${guests}` : ""}
                  {room ? ` • Room: ${room}` : ""}
                </div>
              </div>
            </div>

            <div className="hr" />

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="muted">Base (per night)</span>
              <span style={{ fontWeight: 900 }}>${hotel.price}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="muted">Adjusted (per night)</span>
              <span style={{ fontWeight: 900 }}>${perNight}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="muted">Nights</span>
              <span style={{ fontWeight: 900 }}>{nights || "-"}</span>
            </div>

            <div className="hr" />

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="muted">Total</span>
              <span style={{ fontWeight: 900 }}>${total}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
