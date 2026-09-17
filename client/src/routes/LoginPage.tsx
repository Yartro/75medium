import { useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { FlapDigitBank } from "../components/Flap";

export function LoginPage() {
  const { auth, login, loginError, isLoggingIn } = useAuth();
  const [name, setName] = useState("");

  if (auth) return <Navigate to="/" replace />;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    await login(name.trim());
  }

  return (
    <div className="login-page">
      <div>
        <div className="login-plate">
          <FlapDigitBank value={75} size="xl" />
          <div className="login-plate__word">Medium</div>
        </div>
        <p className="login-page__subtitle" style={{ marginTop: 18 }}>
          Vul je naam in
        </p>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="text"
          inputMode="text"
          autoFocus
          autoCapitalize="words"
          autoComplete="off"
          placeholder="Ray"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {loginError && <span className="login-error">{loginError}</span>}
        <button type="submit" className="btn primary block" disabled={isLoggingIn || !name.trim()}>
          {isLoggingIn ? "Bezig..." : "Inloggen"}
        </button>
      </form>
    </div>
  );
}
