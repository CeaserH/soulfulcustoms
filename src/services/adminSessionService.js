export const ADMIN_SESSION_KEY = "soulfulCustomsAdminSessionExpiresAt";
export const ADMIN_SESSION_LENGTH = 15 * 60 * 1000;

export function getAdminSessionExpiration() {
  return Number(localStorage.getItem(ADMIN_SESSION_KEY) || 0);
}

export function startAdminSession() {
  localStorage.setItem(
    ADMIN_SESSION_KEY,
    String(Date.now() + ADMIN_SESSION_LENGTH),
  );
}

export function clearAdminSession() {
  localStorage.removeItem(ADMIN_SESSION_KEY);
}

export function hasActiveAdminSession() {
  return getAdminSessionExpiration() > Date.now();
}
