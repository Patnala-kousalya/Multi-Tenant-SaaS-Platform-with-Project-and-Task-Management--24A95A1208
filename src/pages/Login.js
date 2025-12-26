export default function Login() {
  return (
    <div style={{ padding: 40 }}>
      <h2>Login</h2>
      <input placeholder="Email" /><br /><br />
      <input placeholder="Password" type="password" /><br /><br />
      <input placeholder="Tenant Subdomain" /><br /><br />
      <button>Login</button>
    </div>
  );
}
