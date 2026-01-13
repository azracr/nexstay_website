import { useState } from "react";

export default function Login() {
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e) => {
    e.preventDefault();
    alert(tab === "login" ? "Logged in (mock)" : "Account created (mock)");
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 74px)",
        display: "grid",
        placeItems: "center",
        background:
          "radial-gradient(900px 420px at 50% 0%, rgba(37,99,235,0.14), transparent 60%), linear-gradient(180deg, #f8fafc, #ffffff)",
      }}
    >
      <div
        className="card"
        style={{
          width: "min(420px, 100%)",
          padding: 22,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div style={{ fontWeight: 1000, fontSize: 26, marginBottom: 6 }}>
            Welcome back
          </div>
          <div className="muted">
            Login to manage your bookings faster.
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          <button
            className={`btn ${tab === "login" ? "" : "secondary"}`}
            style={{ flex: 1 }}
            onClick={() => setTab("login")}
          >
            Login
          </button>
          <button
            className={`btn ${tab === "signup" ? "" : "secondary"}`}
            style={{ flex: 1 }}
            onClick={() => setTab("signup")}
          >
            Sign up
          </button>
        </div>

        <form onSubmit={submit}>
          <div style={{ display: "grid", gap: 10 }}>
            <div>
              <div className="muted" style={{ fontSize: 12, fontWeight: 800, marginBottom: 6 }}>
                Email
              </div>
              <input
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
              />
            </div>

            <div>
              <div className="muted" style={{ fontSize: 12, fontWeight: 800, marginBottom: 6 }}>
                Password
              </div>
              <input
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <button className="btn" type="submit" style={{ height: 44, borderRadius: 14 }}>
              {tab === "login" ? "Login" : "Create account"}
            </button>

            <div className="muted" style={{ fontSize: 12, textAlign: "center" }}>
              This is a mock login for the course project (no real backend).
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
