export function isStoreTypeSupported(storeType: string): boolean {
  switch (storeType) {
    case "localstorage":
      return typeof window.localStorage !== "undefined";
    case "sessionstorage":
      return typeof window.sessionStorage !== "undefined";
    case "cookies":
      return typeof document.cookie !== "undefined";
    case "indexeddb":
      return isIndexedDBSupported();
    default:
      return false;
  }
}

export function isIndexedDBSupported(): boolean {
  const indexedDB =
    window.indexedDB ||
    (window as any).mozIndexedDB ||
    (window as any).webkitIndexedDB ||
    (window as any).msIndexedDB ||
    (window as any).shimIndexedDB;
  return typeof indexedDB !== "undefined";
}

export function getStore(storeType: string): Storage {
  return storeType === "localstorage" ? localStorage : sessionStorage;
}

export function isKeyValid(key: string): boolean {
  return typeof key === "string" && key.trim() !== "";
}

export function isValueValid(value: any): boolean {
  return typeof value !== "undefined";
}
