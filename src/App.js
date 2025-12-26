import React, { useState } from "react";

const API = "http://localhost:5000/api";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tenant, setTenant] = useState("");
  const [token, setToken] = useState("");
  const [users, setUsers] = useState([]);

  const login = async () => {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        tenantSubdomain: tenant,
      }),
    });

    const data = await res.json();
    if (data.success) {
      setToken(data.data.token);
      alert("Login successful");
    } else {
      alert(data.message);
    }
  };

  const getUsers = async () => {
    const res = await fetch(
      `${API}/tenants/${JSON.parse(atob(token.split(".")[1])).tenantId}/users`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await res.json();
    if (data.success) setUsers(data.data);
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Multi-Tenant SaaS</h2>

      {!token && (
        <>
          <input placeholder="Tenant Subdomain" onChange={e => setTenant(e.target.value)} /><br /><br />
          <input placeholder="Email" onChange={e => setEmail(e.target.value)} /><br /><br />
          <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} /><br /><br />
          <button onClick={login}>Login</button>
        </>
      )}

      {token && (
        <>
          <h3>Dashboard</h3>
          <button onClick={getUsers}>Load Users</button>
          <ul>
            {users.map(u => (
              <li key={u.id}>{u.email} ({u.role})</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
