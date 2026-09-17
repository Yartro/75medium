export interface User {
  id: string;
  name: string;
}

// Hardcoded team of 6. Logging in is just typing your own first name
// (case-insensitive) - no separate code or password.
export const USERS: User[] = [
  { id: "daan", name: "Daan" },
  { id: "jochem", name: "Jochem" },
  { id: "lieke", name: "Lieke" },
  { id: "noortje", name: "Noortje" },
  { id: "ray", name: "Ray" },
  { id: "rick", name: "Rick" },
];

export function findUserByName(name: string): User | undefined {
  const normalized = name.trim().toLowerCase();
  return USERS.find((u) => u.name.toLowerCase() === normalized);
}

export function findUserById(id: string): User | undefined {
  return USERS.find((u) => u.id === id);
}
