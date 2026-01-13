import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const [destination, setDestination] = useState("İstanbul");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);

  const onSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set("city", destination.trim());
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    params.set("guests", String(guests));
    navigate(`/results?${params.toString()}`);
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 84px)",
        position: "relative",
        overflow: "hidden",
        backgroundImage:
          'radial-gradient(1200px 520px at 50% 0%, rgba(37,99,235,0.14), transparent 60%), radial-gradient(900px 380px at 80% 20%, rgba(147,51,234,0.10), transparent 55%), url("/hero.jpg")',
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right center",
        backgroundSize: "cover",
        backgroundAttachment: "scroll",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(15,23,42,0.06) 1px, transparent 0)",
          backgroundSize: "22px 22px",
          opacity: 0.18,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.55) 55%, rgba(255,255,255,0.28) 78%, rgba(255,255,255,0.10) 100%)",
          pointerEvents: "none",
        }}
      />

      <div
        className="container"
        style={{ paddingTop: 18, paddingBottom: 44, position: "relative" }}
      >
        <div style={{ textAlign: "center", marginTop: 18 }}>
          <h1 className="h1" style={{ marginBottom: 10 }}>
            Find your next stay
          </h1>
          <p className="sub" style={{ marginBottom: 0 }}>
            Search low prices on hotels and compare options easily.
          </p>
        </div>

        <div style={{ marginTop: 26, display: "flex", justifyContent: "center" }}>
          <form
            onSubmit={onSearch}
            className="card"
            style={{
              width: "min(980px, 100%)",
              padding: 18,
              backdropFilter: "blur(6px)",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.4fr 1fr 1fr .7fr .6fr",
                gap: 12,
                alignItems: "end",
              }}
            >
              <div>
                <div
                  className="muted"
                  style={{ fontSize: 12, fontWeight: 800, marginBottom: 6 }}
                >
                  Where are you going?
                </div>
                <input
                  className="input"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="City or district (e.g., Muğla / Bodrum)"
                />
              </div>

              <div>
                <div
                  className="muted"
                  style={{ fontSize: 12, fontWeight: 800, marginBottom: 6 }}
                >
                  Check-in
                </div>
                <input
                  className="input"
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                />
              </div>

              <div>
                <div
                  className="muted"
                  style={{ fontSize: 12, fontWeight: 800, marginBottom: 6 }}
                >
                  Check-out
                </div>
                <input
                  className="input"
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                />
              </div>

              <div>
                <div
                  className="muted"
                  style={{ fontSize: 12, fontWeight: 800, marginBottom: 6 }}
                >
                  Guests
                </div>
                <input
                  className="input"
                  type="number"
                  min={1}
                  max={10}
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                />
              </div>

              <button className="btn" type="submit" style={{ height: 42, borderRadius: 14 }}>
                Search
              </button>
            </div>

            <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <span className="badge">Sea</span>
              <span className="badge">Ski</span>
              <span className="badge">Thermal</span>
              <span className="badge">Nature</span>
            </div>
          </form>
        </div>

        <div
          style={{
            marginTop: 22,
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 14,
            maxWidth: 980,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <div className="card" style={{ padding: 14 }}>
            <div style={{ fontWeight: 900, marginBottom: 6 }}>Compare Easily</div>
            <div className="muted" style={{ fontSize: 13 }}>
              Select up to 3 hotels and compare price, rating, category, and type.
            </div>
          </div>

          <div className="card" style={{ padding: 14 }}>
            <div style={{ fontWeight: 900, marginBottom: 6 }}>Smart Filters</div>
            <div className="muted" style={{ fontSize: 13 }}>
              Filter by max price, min rating, category, and sorting.
            </div>
          </div>

          <div className="card" style={{ padding: 14 }}>
            <div style={{ fontWeight: 900, marginBottom: 6 }}>My Bookings</div>
            <div className="muted" style={{ fontSize: 13 }}>
              Save bookings locally and manage upcoming, past, and cancelled tabs.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
