declare module 'js-cookie' {
  interface Cookies {
    get(key: string): string | undefined;
    set(key: string, value: string | object, options?: Cookies.CookieAttributes): void;
    remove(key: string, options?: Cookies.CookieAttributes): void;
  }

  const Cookies: Cookies;
  export = Cookies;
}
