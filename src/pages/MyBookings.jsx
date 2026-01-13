import { useEffect, useMemo, useState } from "react";
import { getBookings, updateBooking } from "../utils/storage";

export default function MyBookings() {
  const [tab, setTab] = useState("upcoming");
  const [list, setList] = useState(getBookings());

  const toDate = (s) => {
    if (!s) return null;
    const d = new Date(`${s}T00:00:00`);
    return Number.isNaN(d.getTime()) ? null : d;
  };

  const today = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  };

  useEffect(() => {
    const t = today();
    const current = getBookings();

    let updatedList = current;
    let changed = false;

    for (const b of current) {
      if (b.status !== "upcoming") continue;
      const outD = toDate(b.checkOut);
      if (!outD) continue;

      if (outD < t) {
        updatedList = updateBooking(b.id, { status: "past" });
        changed = true;
      }
    }

    if (changed) setList(updatedList);
    else setList(current);
  }, []);

  const filtered = useMemo(() => list.filter((b) => b.status === tab), [list, tab]);

  const cancel = (id) => {
    const updated = updateBooking(id, { status: "cancelled" });
    setList(updated);
  };

  return (
    <div className="page-bg">
      <div className="page-content">
        <div className="container pageInner">
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>My Bookings</h2>
          <div className="muted">Bookings are stored locally (course mock).</div>

          <div className="row" style={{ marginTop: 12 }}>
            <button className={`btn ${tab === "upcoming" ? "" : "secondary"}`} onClick={() => setTab("upcoming")}>
              Upcoming
            </button>
            <button className={`btn ${tab === "past" ? "" : "secondary"}`} onClick={() => setTab("past")}>
              Past
            </button>
            <button className={`btn ${tab === "cancelled" ? "" : "secondary"}`} onClick={() => setTab("cancelled")}>
              Cancelled
            </button>
          </div>

          <div className="hr" />

          {filtered.length === 0 ? (
            <div className="card soft" style={{ padding: 16 }}>
              No bookings in this tab.
            </div>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              {filtered.map((b) => {
                const hasDates = !!(b.checkIn || b.checkOut);
                const hasLocation = !!(b.city || b.area);
                const hasGuests = b.guests !== undefined && b.guests !== null && String(b.guests).trim() !== "";

                return (
                  <div
                    key={b.id}
                    className="card soft"
                    style={{ padding: 14, display: "grid", gridTemplateColumns: "140px 1fr", gap: 14 }}
                  >
                    <img
                      src={b.image}
                      alt={b.hotelName}
                      style={{
                        width: "100%",
                        height: 110,
                        objectFit: "cover",
                        borderRadius: 12,
                        border: "1px solid #e5e7eb",
                      }}
                    />

                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 900 }}>{b.hotelName}</div>

                        {hasLocation ? (
                          <div className="muted" style={{ marginTop: 6 }}>
                            {b.city ? b.city : ""}
                            {b.city && b.area ? " • " : ""}
                            {b.area ? b.area : ""}
                            {hasGuests ? ` • Guests: ${b.guests}` : ""}
                          </div>
                        ) : hasGuests ? (
                          <div className="muted" style={{ marginTop: 6 }}>Guests: {b.guests}</div>
                        ) : null}

                        {hasDates ? (
                          <div className="muted" style={{ marginTop: 6 }}>
                            {b.checkIn ? b.checkIn : ""}
                            {b.checkIn && b.checkOut ? " → " : ""}
                            {b.checkOut ? b.checkOut : ""}
                            {b.room ? ` • Room: ${b.room}` : ""}
                            {b.nights ? ` • Nights: ${b.nights}` : ""}
                          </div>
                        ) : b.room ? (
                          <div className="muted" style={{ marginTop: 6 }}>Room: {b.room}</div>
                        ) : null}
                      </div>

                      <div style={{ textAlign: "right" }}>
                        {b.totalPrice !== undefined && b.totalPrice !== null ? (
                          <div style={{ fontWeight: 900 }}>${b.totalPrice}</div>
                        ) : null}

                        {b.status === "upcoming" ? (
                          <button className="btn secondary" style={{ marginTop: 10 }} onClick={() => cancel(b.id)}>
                            Cancel
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
