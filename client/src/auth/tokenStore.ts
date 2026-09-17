const STORAGE_KEY = "75challenge.auth";

export interface StoredAuth {
  token: string;
  userId: string;
  name: string;
}

type Listener = (auth: StoredAuth | null) => void;

function loadFromStorage(): StoredAuth | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredAuth) : null;
  } catch {
    return null;
  }
}

let current: StoredAuth | null = loadFromStorage();
const listeners = new Set<Listener>();

export function getAuth(): StoredAuth | null {
  return current;
}

export function setAuth(auth: StoredAuth | null): void {
  current = auth;
  try {
    if (auth) localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // localStorage unavailable (private browsing etc.) - session still works in-memory for this tab
  }
  listeners.forEach((listener) => listener(current));
}

export function subscribeAuth(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
