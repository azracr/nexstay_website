import { Link, NavLink } from "react-router-dom";

export default function Header() {
  const linkStyle = ({ isActive }) => ({
    textDecoration: "none",
    fontWeight: 800,
    fontSize: 14,
    color: isActive ? "#1d4ed8" : "#334155",
    padding: "10px 12px",
    borderRadius: 12,
    background: isActive ? "rgba(37,99,235,0.10)" : "transparent",
  });

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(255,255,255,0.88)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(15,23,42,0.08)",
        boxShadow: "0 8px 30px rgba(15,23,42,0.06)",
      }}
    >
      <div
        className="container"
        style={{
          height: 84,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: 18,
              display: "grid",
              placeItems: "center",
              background: "linear-gradient(135deg, rgba(37,99,235,1), rgba(147,51,234,1))",
              boxShadow: "0 12px 30px rgba(2,6,23,0.20)",
            }}
          >
            <span style={{ fontSize: 18, color: "white" }}>⌂</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
            <span
              style={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 800,
                letterSpacing: 0.2,
                fontSize: 32,
                color: "#0f172a",
              }}
            >
              NexStay
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b" }}>
              Hotel Finder
            </span>
          </div>
        </Link>

        <nav style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <NavLink to="/" style={linkStyle}>
            Home
          </NavLink>
          <NavLink to="/bookings" style={linkStyle}>
            My Bookings
          </NavLink>
          <NavLink to="/compare" style={linkStyle}>
            Compare
          </NavLink>
          <NavLink to="/login" style={linkStyle}>
            Login
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
