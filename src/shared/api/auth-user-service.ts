export type AuthUser = {
  authToken: string;
  refreshToken: string;
  domainId: string;
}

type AuthUserListener = () => void;

export const AuthUserService = {
  _user: null as AuthUser | null,
  _listeners: new Set<AuthUserListener>(),

  get(): AuthUser | null {
    if (!this._user && typeof window !== "undefined") {
      try {
        this._user = JSON.parse(localStorage.getItem("auth-user") || "null");
      } catch {
        this._user = null;
      }
    }
    return this._user;
  },

  update(newUser: AuthUser) {
    this._user = newUser;
    if (typeof window !== "undefined") {
      localStorage.setItem("auth-user", JSON.stringify(newUser));
    }
    this._listeners.forEach(cb => cb());
  },

  subscribe(cb: AuthUserListener) {
    this._listeners.add(cb);
    return () => this._listeners.delete(cb);
  },
};