export interface CookieOptions {
  expires?: Date;
  path?: string;
}

export interface LionXStorageInstance {
  set(key: string, value: any, options?: CookieOptions): void;
  get(key: string): any | null;
  update(key: string, value: any): void;
  remove(key: string, id?: any): void;
}
