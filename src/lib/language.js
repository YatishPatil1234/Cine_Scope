export const COOKIE_NAME = "preferred_lang";
export const DEFAULT_LANG = "en-US";

export function getLanguageFromCookie(cookieStore) {
  return cookieStore?.get(COOKIE_NAME)?.value ?? DEFAULT_LANG;
}

export function getLanguageFromDocument() {
  if (typeof document === "undefined") return DEFAULT_LANG;
  const match = document.cookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : DEFAULT_LANG;
}

export function setLanguageCookie(lang) {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(lang)};path=/;max-age=31536000;SameSite=Lax`;
}
