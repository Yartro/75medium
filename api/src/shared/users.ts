export interface User {
  id: string;
  name: string;
  code: string;
}

// Hardcoded team of 6. No personal data beyond a first name and a shared "code"
// (not a real password) — edit codes here before real use.
export const USERS: User[] = [
  { id: "daan", name: "Daan", code: "daan123" },
  { id: "jochem", name: "Jochem", code: "jochem123" },
  { id: "lieke", name: "Lieke", code: "lieke123" },
  { id: "noortje", name: "Noortje", code: "noortje123" },
  { id: "ray", name: "Ray", code: "ray123" },
  { id: "rick", name: "Rick", code: "rick123" },
];

export function findUserByCode(code: string): User | undefined {
  return USERS.find((u) => u.code === code);
}

export function findUserById(id: string): User | undefined {
  return USERS.find((u) => u.id === id);
}
