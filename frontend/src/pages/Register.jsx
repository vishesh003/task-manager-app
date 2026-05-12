import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API_URL from "../config.js";
function Register() {
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const navigate                = useNavigate();

  async function handleRegister() {
    try {
      const res  = await fetch(`${API_URL}/auth/register`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message); return; }
      navigate("/login");
    } catch (err) {
      setError("Something went wrong");
    }
  }

  return (
    <div style={{ maxWidth: "400px", margin: "100px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h2>Register</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input placeholder="Name" value={name}
        onChange={e => setName(e.target.value)}
        style={{ display: "block", width: "100%", marginBottom: "10px", padding: "8px" }}
      />
      <input placeholder="Email" value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ display: "block", width: "100%", marginBottom: "10px", padding: "8px" }}
      />
      <input placeholder="Password" type="password" value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ display: "block", width: "100%", marginBottom: "10px", padding: "8px" }}
      />
      <button onClick={handleRegister}
        style={{ width: "100%", padding: "10px", backgroundColor: "green", color: "white", border: "none", borderRadius: "4px" }}>
        Register
      </button>
      <p>Have account? <Link to="/login">Login</Link></p>
    </div>
  );
}

export default Register;