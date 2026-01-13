import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import HotelCard from "../components/HotelCard";

export default function Results() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const queryRaw = (searchParams.get("city") || "").trim();
  const query = queryRaw.toLocaleLowerCase("tr-TR");

  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const guests = searchParams.get("guests") || "2";

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  const [maxPrice, setMaxPrice] = useState(999);
  const [minRating, setMinRating] = useState("Any");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("priceAsc");

  const readCompareFromURL = () => {
    const raw = searchParams.get("compare") || "";
    const arr = raw
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
    return Array.from(new Set(arr)).slice(0, 3);
  };

  const [compareIds, setCompareIds] = useState(() => readCompareFromURL());

  useEffect(() => {
    setCompareIds(readCompareFromURL());
  }, [location.search]);

  useEffect(() => {
    fetch("/hotels.json")
      .then((r) => r.json())
      .then((d) => setHotels(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, []);

  const searchQS = useMemo(() => {
    const p = new URLSearchParams();
    if (checkIn) p.set("checkIn", checkIn);
    if (checkOut) p.set("checkOut", checkOut);
    if (guests) p.set("guests", guests);
    if (queryRaw) p.set("city", queryRaw);

    if (compareIds.length) p.set("compare", compareIds.join(","));
    return p.toString();
  }, [checkIn, checkOut, guests, queryRaw, compareIds]);

  const filtered = useMemo(() => {
    let list = hotels.filter((h) => {
      const cityMatch = typeof h.city === "string" && h.city.toLocaleLowerCase("tr-TR") === query;
      const areaMatch = typeof h.area === "string" && h.area.toLocaleLowerCase("tr-TR") === query;
      return cityMatch || areaMatch;
    });

    list = list.filter((h) => (h.price ?? 0) <= maxPrice);

    if (minRating !== "Any") {
      const r = Number(minRating);
      list = list.filter((h) => (h.rating ?? 0) >= r);
    }

    if (category !== "All") {
      list = list.filter((h) => h.category === category);
    }

    if (sortBy === "priceAsc") list = [...list].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    if (sortBy === "priceDesc") list = [...list].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    if (sortBy === "ratingDesc") list = [...list].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

    return list;
  }, [hotels, query, maxPrice, minRating, category, sortBy]);

  const resultText =
    filtered.length === 0 ? "Hotel not found" : filtered.length === 1 ? "1 hotel found" : `${filtered.length} hotel found`;

  const syncCompareToURL = (nextIds) => {
    const p = new URLSearchParams(location.search);

    if (nextIds.length) p.set("compare", nextIds.join(","));
    else p.delete("compare");

    navigate(`${location.pathname}?${p.toString()}`, { replace: true });
  };

  const toggleCompare = (id) => {
    const sid = String(id);
    setCompareIds((prev) => {
      const exists = prev.includes(sid);
      let next = prev;

      if (exists) next = prev.filter((x) => x !== sid);
      else if (prev.length < 3) next = [...prev, sid];

      syncCompareToURL(next);
      return next;
    });
  };

  const goCompare = () => {
    const ids = compareIds.join(",");
    const from = encodeURIComponent(`${location.pathname}${location.search}`);
    navigate(`/compare?ids=${encodeURIComponent(ids)}&from=${from}`);
  };

  if (loading) return <div className="container" style={{ paddingTop: 10 }}>Loading...</div>;

  return (
    <div className="container">
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
        <div>
          <h2 style={{ margin: 0 }}>Results for {queryRaw || "-"}</h2>
          <div className="muted" style={{ marginTop: 6 }}>{resultText}</div>

          {(checkIn || checkOut) ? (
            <div className="muted" style={{ marginTop: 6 }}>
              {checkIn ? checkIn : ""}{checkIn && checkOut ? " → " : ""}{checkOut ? checkOut : ""}{guests ? ` • Guests: ${guests}` : ""}
            </div>
          ) : null}
        </div>

        <button
          className={`btn ${compareIds.length >= 2 ? "" : "secondary"}`}
          onClick={goCompare}
          disabled={compareIds.length < 2}
          style={{ height: 42 }}
        >
          Compare ({compareIds.length}/3)
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 18, alignItems: "start" }}>
        <aside className="card" style={{ padding: 14 }}>
          <div style={{ fontWeight: 800, marginBottom: 10 }}>Filters</div>

          <div style={{ marginBottom: 14 }}>
            <div className="muted" style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Max price (${maxPrice})</div>
            <input type="range" min={50} max={999} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} style={{ width: "100%" }} />
          </div>

          <div style={{ marginBottom: 12 }}>
            <div className="muted" style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Min rating</div>
            <select className="select" value={minRating} onChange={(e) => setMinRating(e.target.value)}>
              <option value="Any">Any</option>
              <option value="3.8">3.8+</option>
              <option value="4.0">4.0+</option>
              <option value="4.2">4.2+</option>
              <option value="4.5">4.5+</option>
            </select>
          </div>

          <div style={{ marginBottom: 12 }}>
            <div className="muted" style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Category</div>
            <select className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="All">All</option>
              <option value="Sea">Sea</option>
              <option value="Ski">Ski</option>
              <option value="Thermal">Thermal</option>
              <option value="Nature">Nature</option>
              <option value="General">General</option>
            </select>
          </div>

          <div style={{ marginBottom: 12 }}>
            <div className="muted" style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Sort</div>
            <select className="select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="priceAsc">Price (low → high)</option>
              <option value="priceDesc">Price (high → low)</option>
              <option value="ratingDesc">Rating (high → low)</option>
            </select>
          </div>

          <button
            className="btn secondary"
            type="button"
            onClick={() => {
              setMaxPrice(999);
              setMinRating("Any");
              setCategory("All");
              setSortBy("priceAsc");
            }}
          >
            Reset
          </button>

          <div className="muted" style={{ marginTop: 10, fontSize: 12 }}>You can select up to 3 hotels for comparison.</div>
        </aside>

        <section>
          {filtered.length === 0 ? (
            <div className="card" style={{ padding: 16 }}>No hotels found for these filters.</div>
          ) : (
            <div className="grid3">
              {filtered.map((h) => (
                <HotelCard
                  key={h.id}
                  hotel={h}
                  search={searchQS}
                  selected={compareIds.includes(String(h.id))}
                  onToggleCompare={toggleCompare}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
