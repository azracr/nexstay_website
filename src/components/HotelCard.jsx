import { Link } from "react-router-dom";

export default function HotelCard({ hotel, search, selected, onToggleCompare }) {
  const detailsUrl = `/hotel/${hotel.id}${search ? `?${search}` : ""}`;

  return (
    <div className="card" style={{ overflow: "hidden" }}>
      <div style={{ width: "100%", height: 170, background: "#eef2ff" }}>
        <img
          src={hotel.image}
          alt={hotel.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>

      <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: 16,
                fontWeight: 800,
                lineHeight: 1.2,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                wordBreak: "break-word",
              }}
            >
              {hotel.name}
            </div>

            <div
              style={{
                marginTop: 6,
                color: "#64748b",
                fontSize: 13,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              title={`${hotel.city}${hotel.area ? " • " + hotel.area : ""} • ${hotel.type}`}
            >
              {hotel.city}
              {hotel.area ? ` • ${hotel.area}` : ""} • {hotel.type}
            </div>
          </div>

          <div style={{ textAlign: "right", minWidth: 92 }}>
            <div style={{ fontWeight: 900, fontSize: 16 }}>${hotel.price}</div>
            <div style={{ color: "#64748b", fontSize: 12 }}>per night</div>
          </div>
        </div>

        <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
          <span className="badge">Rating: {hotel.rating}</span>
          <span className="badge">{hotel.category}</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 700, color: "#334155" }}>
            <input
              type="checkbox"
              checked={!!selected}
              onChange={() => onToggleCompare(hotel.id)}
              style={{ width: 16, height: 16 }}
            />
            Compare
          </label>

          <Link to={detailsUrl} className="btn secondary" style={{ textDecoration: "none" }}>
            View details
          </Link>
        </div>
      </div>
    </div>
  );
}
