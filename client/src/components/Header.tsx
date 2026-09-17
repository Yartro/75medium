import { useAuth } from "../auth/useAuth";
import { IconLogout } from "./icons";

export function Header() {
  const { logout } = useAuth();

  return (
    <header className="app-header steel-plate">
      <span className="rivet" />
      <span className="app-header__brand">75 Medium</span>
      <span className="app-header__right">
        <button className="icon-button" onClick={logout} aria-label="Uitloggen" title="Uitloggen">
          <IconLogout />
        </button>
        <span className="rivet" />
      </span>
    </header>
  );
}
