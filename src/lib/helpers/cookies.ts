import { CookieOptions } from "../types";

// Helper methods for cookies
export function setCookie(
  key: string,
  value: any,
  options: CookieOptions = {}
): void {
  let cookieString = `${encodeURIComponent(key)}=${encodeURIComponent(
    JSON.stringify(value)
  )}`;

  if (options.expires) {
    const expirationDate = new Date(options.expires).toUTCString();
    cookieString += `; expires=${expirationDate}`;
  }

  if (options.path) {
    cookieString += `; path=${options.path}`;
  }

  document.cookie = cookieString;
}

export function getCookie(key: string): any | null {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const cookiesArray = cookie.split("=");
    if (decodeURIComponent(cookiesArray[0]) === key) {
      return JSON.parse(decodeURIComponent(cookiesArray[1]));
    }
  }
  return null;
}

export function removeCookie(key: string): void {
  setCookie(key, "", { expires: new Date(0) });
}

export function updateCookie(key: string, value: any): void {
  if (getCookie(key) !== null) {
    setCookie(key, value);
  }
}
