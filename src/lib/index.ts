import {
  getCookie,
  removeCookie,
  setCookie,
  updateCookie,
} from "./helpers/cookies";
import {
  getStore,
  isKeyValid,
  isStoreTypeSupported,
  isValueValid,
} from "./helpers/utils";
import { CookieOptions, LionXStorageInstance } from "./types";

class LionXStorage implements LionXStorageInstance {
  private storeType: string;
  private databaseName: string | null;
  private version: number | null;
  private db: any; // Adjust the type based on your actual implementation

  constructor(
    storeType: string = "localStorage",
    databaseName?: string | null,
    version?: number | null
  ) {
    this.storeType = storeType.toLowerCase();
    this.databaseName = databaseName || null;
    this.version = version || null;
    this.db = null;

    if (!isStoreTypeSupported(this.storeType)) {
      throw new Error(`Store type '${this.storeType}' is not supported.`);
    }
  }

  set(key: string, value: any, options: CookieOptions = {}): void {
    if (!isKeyValid(key)) {
      throw new Error("Invalid key provided.");
    }

    if (!isValueValid(value)) {
      throw new Error("Invalid value provided.");
    }

    if (this.storeType === "cookies") {
      setCookie(key, value, options);
    } else if (this.storeType === "indexeddb") {
      this.setIndexedDB(key, value);
    } else {
      getStore(this.storeType).setItem(key, JSON.stringify(value));
    }
  }

  get(key: string): any | null {
    if (!isKeyValid(key)) {
      throw new Error("Invalid key provided.");
    }

    if (this.storeType === "cookies") {
      return getCookie(key);
    } else if (this.storeType === "indexeddb") {
      return this.getIndexedDB(key);
    } else {
      const storedValue = getStore(this.storeType).getItem(key);
      return storedValue ? JSON.parse(storedValue) : null;
    }
  }

  update(key: string, value: any): void {
    if (!isKeyValid(key)) {
      throw new Error("Invalid key provided.");
    }

    if (!isValueValid(value)) {
      throw new Error("Invalid value provided.");
    }

    if (this.storeType === "cookies") {
      updateCookie(key, value);
    } else if (this.storeType === "indexeddb") {
      this.updateIndexedDB(key, value.id, value);
    } else {
      if (getStore(this.storeType).getItem(key) !== null) {
        this.set(key, value);
      }
    }
  }

  remove(key: string, id?: any): void {
    if (!isKeyValid(key)) {
      throw new Error("Invalid key provided.");
    }

    if (this.storeType === "cookies") {
      removeCookie(key);
    } else if (this.storeType === "indexeddb") {
      this.removeIndexedDB(key, id);
    } else {
      getStore(this.storeType).removeItem(key);
    }
  }

  // IndexedDB methods
  async init(
    objectStoreNames: string[] = [],
    keyPath: string = "id",
    deleteObjectStore: string[] = []
  ): Promise<void> {
    if (this.storeType === "indexeddb") {
      if (this.db) {
        return; // Database is already open, no need to initialize again
      }

      const indexedDB =
        window.indexedDB ||
        (window as any).mozIndexedDB ||
        (window as any).webkitIndexedDB ||
        (window as any).msIndexedDB ||
        (window as any).shimIndexedDB;

      return new Promise((resolve, reject) => {
        const request = indexedDB.open(
          this.databaseName as string,
          this.version as number
        );

        request.onupgradeneeded = (event: any) => {
          const db = event.target.result;

          // Create object stores
          objectStoreNames.forEach((objectStoreName) => {
            if (!db.objectStoreNames.contains(objectStoreName)) {
              const options = keyPath ? { keyPath } : {};
              db.createObjectStore(objectStoreName, options);
            }
          });

          // Delete object stores
          deleteObjectStore.forEach((objectStoreName) => {
            if (db.objectStoreNames.contains(objectStoreName)) {
              db.deleteObjectStore(objectStoreName);
            }
          });
        };

        request.onsuccess = () => {
          this.db = request.result;
          resolve();
        };

        request.onerror = (event: any) => {
          reject(new Error(`Failed to open database: ${event.target.error}`));
        };
      });
    } else {
      throw new Error("Invalid store type");
    }
  }

  async getIndexedDB(objectStoreName: string, key?: string): Promise<any> {
    try {
      await this.init([objectStoreName]);
      const transaction = this.db.transaction(objectStoreName, "readonly");
      const store = transaction.objectStore(objectStoreName);
      return new Promise((resolve, reject) => {
        const request =
          typeof key !== "undefined" ? store.get(key) : store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () =>
          reject(new Error(`Failed to get data from ${objectStoreName}`));
      });
    } catch (error) {
      console.error("Error in get:", error);
      throw error;
    }
  }

  async setIndexedDB(objectStoreName: string, value: any): Promise<void> {
    try {
      await this.init([objectStoreName]);
      const transaction = this.db.transaction(objectStoreName, "readwrite");
      const store = transaction.objectStore(objectStoreName);
      return new Promise((resolve, reject) => {
        const request = store.put(value);
        request.onsuccess = () => resolve();
        request.onerror = () =>
          reject(new Error(`Failed to set data in ${objectStoreName}`));
      });
    } catch (error) {
      console.error("Error in set:", error);
      throw error;
    }
  }

  async updateIndexedDB(
    objectStoreName: string,
    key: string,
    updateData: any
  ): Promise<any> {
    try {
      await this.init([objectStoreName]);
      const transaction = this.db.transaction(objectStoreName, "readwrite");
      const store = transaction.objectStore(objectStoreName);

      return new Promise((resolve, reject) => {
        const getRequest = store.get(key);
        getRequest.onsuccess = () => {
          const existingData = getRequest.result;
          const updatedData = { ...existingData, ...updateData };
          const putRequest = store.put(updatedData);
          putRequest.onsuccess = () => resolve(updatedData);
          putRequest.onerror = () =>
            reject(new Error(`Failed to update data in ${objectStoreName}`));
        };

        getRequest.onerror = () => {
          reject(
            new Error(
              `Failed to retrieve data with key ${key} from ${objectStoreName}`
            )
          );
        };
      });
    } catch (error) {
      console.error("Error in update:", error);
      throw error;
    }
  }

  async removeIndexedDB(objectStoreName: string, key: string): Promise<void> {
    try {
      await this.init([objectStoreName]);
      const transaction = this.db.transaction(objectStoreName, "readwrite");
      const store = transaction.objectStore(objectStoreName);
      return new Promise((resolve, reject) => {
        const request = store.delete(key);
        request.onsuccess = () => resolve();
        request.onerror = () =>
          reject(new Error(`Failed to delete data from ${objectStoreName}`));
      });
    } catch (error) {
      console.error("Error in delete:", error);
      throw error;
    }
  }
}

export default LionXStorage;
