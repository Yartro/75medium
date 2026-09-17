import { NavLink } from "react-router-dom";
import { IconSettings, IconTeam, IconToday } from "./icons";

const links = [
  { to: "/", label: "Vandaag", Icon: IconToday, end: true },
  { to: "/team", label: "Team", Icon: IconTeam, end: false },
  { to: "/settings", label: "Instellingen", Icon: IconSettings, end: false },
];

export function BottomNav() {
  return (
    <nav className="bottom-nav steel-plate">
      <div className="bottom-nav__inner">
        {links.map(({ to, label, Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `bottom-nav__link${isActive ? " active" : ""}`}
          >
            <Icon />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
