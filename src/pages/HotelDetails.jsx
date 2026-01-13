import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";

export default function HotelDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const guests = searchParams.get("guests") || "";

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/hotels.json")
      .then((r) => r.json())
      .then((d) => setHotels(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, []);

  const hotel = useMemo(() => hotels.find((h) => String(h.id) === String(id)), [hotels, id]);

  const qs = useMemo(() => {
    const p = new URLSearchParams();
    if (checkIn) p.set("checkIn", checkIn);
    if (checkOut) p.set("checkOut", checkOut);
    if (guests) p.set("guests", guests);
    return p.toString();
  }, [checkIn, checkOut, guests]);

  const goCheckout = () => {
    navigate(`/checkout/${id}${qs ? `?${qs}` : ""}`);
  };

  if (loading) return <div className="container">Loading...</div>;
  if (!hotel) return <div className="container">Hotel not found.</div>;

  const hasDates = !!(checkIn || checkOut);
  const hasGuests = !!guests;

  return (
    <div className="container">
      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ width: "100%", height: 320, background: "#eef2ff" }}>
          <img src={hotel.image} alt={hotel.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>

        <div style={{ padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
            <div style={{ minWidth: 0 }}>
              <h2 style={{ marginTop: 0, marginBottom: 8 }}>{hotel.name}</h2>
              <div className="muted">
                {hotel.city}{hotel.area ? ` • ${hotel.area}` : ""} • {hotel.type} • {hotel.category}
              </div>

              {hasDates || hasGuests ? (
                <div className="muted" style={{ marginTop: 8 }}>
                  {hasDates ? (
                    <>
                      {checkIn ? checkIn : ""}{checkIn && checkOut ? " → " : ""}{checkOut ? checkOut : ""}
                    </>
                  ) : null}
                  {hasDates && hasGuests ? " • " : ""}
                  {hasGuests ? `Guests: ${guests}` : ""}
                </div>
              ) : null}
            </div>

            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 22, fontWeight: 900 }}>${hotel.price}</div>
              <div className="muted" style={{ fontSize: 12 }}>per night</div>
              <div className="badge" style={{ marginTop: 10 }}>Rating: {hotel.rating}</div>
            </div>
          </div>

          <div className="hr" />

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn" onClick={goCheckout}>Book now</button>
            <Link className="btn secondary" to={-1} style={{ textDecoration: "none" }}>Back</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
