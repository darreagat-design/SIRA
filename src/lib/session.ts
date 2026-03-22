export type SessionUser = {
  id: string;
  nombre: string;
  correo: string;
  rol: string;
};

const SESSION_STORAGE_KEY = "sira.session.user";

export function readSessionUser() {
  if (typeof window === "undefined") {
    return null;
  }

  const rawUser = window.sessionStorage.getItem(SESSION_STORAGE_KEY);

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as SessionUser;
  } catch {
    window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
}

export function saveSessionUser(user: SessionUser) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
}

export function clearSessionUser() {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
}
