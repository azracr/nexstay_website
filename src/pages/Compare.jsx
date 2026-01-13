import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

export default function Compare() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const idsRaw = (searchParams.get("ids") || "").trim();
  const from = searchParams.get("from") || "";

  const ids = useMemo(() => {
    const arr = idsRaw
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
    return Array.from(new Set(arr)).slice(0, 3);
  }, [idsRaw]);

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/hotels.json")
      .then((r) => r.json())
      .then((d) => setHotels(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, []);

  const selected = useMemo(() => {
    const list = hotels.filter((h) => ids.includes(String(h.id)));
    const rank = new Map(ids.map((v, i) => [v, i]));
    return list.sort((a, b) => (rank.get(String(a.id)) ?? 99) - (rank.get(String(b.id)) ?? 99));
  }, [hotels, ids]);

  const goResults = () => {
    if (from) {
      navigate(decodeURIComponent(from));
      return;
    }
    navigate("/results");
  };

  const clearAll = () => {
    const qs = from ? `?from=${from}` : "";
    navigate(`/compare${qs}`);
  };

  const removeId = (id) => {
    const target = String(id);
    const next = ids.filter((x) => x !== target);

    const p = new URLSearchParams();
    if (next.length) p.set("ids", next.join(","));
    if (from) p.set("from", from);

    const qs = p.toString();
    navigate(`/compare${qs ? `?${qs}` : ""}`);
  };

  const showSearchAgain = selected.length > 0;
  const canCompare = selected.length >= 2;

  if (loading) {
    return (
      <div className="page-bg">
        <div className="page-content">
          <div className="container pageInner">
            <div className="card soft" style={{ padding: 16 }}>Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-bg">
      <div className="page-content">
        <div className="container pageInner">
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
            <div>
              <h2 style={{ marginTop: 0, marginBottom: 6 }}>Compare Hotels</h2>
              <div className="muted">Select 2 or 3 hotels from Results to compare.</div>
              <div className="muted" style={{ marginTop: 8, fontSize: 13 }}>
                Selected: <b>{selected.length}</b>/3
              </div>
            </div>

            <div className="row" style={{ justifyContent: "flex-end" }}>
              <button className="btn secondary" onClick={clearAll} disabled={ids.length === 0} style={{ height: 42 }}>
                Clear
              </button>

              {showSearchAgain ? (
                <button className="btn secondary" onClick={goResults} style={{ height: 42 }}>
                  Search again
                </button>
              ) : null}

              <Link
                to="/"
                className="btn"
                style={{ textDecoration: "none", height: 42, display: "inline-flex", alignItems: "center" }}
              >
                Back to Home
              </Link>
            </div>
          </div>

          <div className="hr" />

          {!canCompare ? (
            <div className="card soft" style={{ padding: 18 }}>
              <div style={{ fontWeight: 900, marginBottom: 6 }}>Not enough hotels selected</div>
              <div className="muted">Go to Results and choose at least 2 hotels using “Compare”.</div>

              {selected.length > 0 ? (
                <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
                  {selected.map((h) => (
                    <div
                      key={h.id}
                      className="card"
                      style={{
                        padding: 12,
                        display: "grid",
                        gridTemplateColumns: "70px 1fr auto",
                        gap: 12,
                        alignItems: "center",
                        boxShadow: "none",
                      }}
                    >
                      <img
                        src={h.image}
                        alt={h.name}
                        style={{ width: 70, height: 52, objectFit: "cover", borderRadius: 12, border: "1px solid #e5e7eb" }}
                      />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 900, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {h.name}
                        </div>
                        <div className="muted" style={{ marginTop: 2, fontSize: 13 }}>
                          {h.city}{h.area ? ` • ${h.area}` : ""} • ${h.price}/night
                        </div>
                      </div>
                      <button className="btn secondary" onClick={() => removeId(h.id)} style={{ height: 38 }}>
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}

              <div className="row" style={{ marginTop: 14 }}>
                <button className="btn" onClick={goResults}>Go search</button>
              </div>
            </div>
          ) : (
            <div className="card soft" style={{ padding: 14, overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 920 }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: 10, borderBottom: "1px solid #e5e7eb" }}>Feature</th>
                    {selected.map((h) => (
                      <th key={h.id} style={{ textAlign: "left", padding: 10, borderBottom: "1px solid #e5e7eb" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                          <div style={{ fontWeight: 900, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {h.name}
                          </div>
                          <button
                            className="btn secondary"
                            style={{ padding: "8px 10px", borderRadius: 10 }}
                            onClick={() => removeId(h.id)}
                          >
                            Remove
                          </button>
                        </div>

                        <div style={{ marginTop: 10 }}>
                          <img
                            src={h.image}
                            alt={h.name}
                            style={{ width: 240, height: 130, objectFit: "cover", borderRadius: 12, border: "1px solid #e5e7eb" }}
                          />
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {[
                    ["City", (h) => h.city],
                    ["Area", (h) => h.area || "-"],
                    ["Category", (h) => h.category],
                    ["Type", (h) => h.type],
                    ["Price", (h) => `$${h.price} / night`],
                    ["Rating", (h) => h.rating],
                  ].map(([label, fn]) => (
                    <tr key={label}>
                      <td style={{ padding: 10, borderBottom: "1px solid #e5e7eb", fontWeight: 800 }}>{label}</td>
                      {selected.map((h) => (
                        <td key={h.id + label} style={{ padding: 10, borderBottom: "1px solid #e5e7eb" }}>
                          {fn(h)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
