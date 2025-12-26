export default function Register() {
  return (
    <div style={{ padding: 40 }}>
      <h2>Register Tenant</h2>
      <input placeholder="Company Name" /><br /><br />
      <input placeholder="Subdomain" /><br /><br />
      <input placeholder="Admin Email" /><br /><br />
      <input placeholder="Admin Name" /><br /><br />
      <input placeholder="Password" type="password" /><br /><br />
      <button>Register</button>
    </div>
  );
}
