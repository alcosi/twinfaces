// This file is only imported in development via dynamic import.

export type DevTools = {
  update: (...args: any[]) => void;
  auth: {
    token: () => string | undefined;
    setToken: (value: string, opts?: { maxAgeSec?: number }) => void;
    invalidate: () => void;
    validate: () => Promise<void>;
  };
  after: (ms: number, fn: () => void) => number;
};

type InstallOptions = {
  /** Cookie name for auth token (default: "authToken") */
  tokenName?: string;
  /** Provide a way to fetch a valid token if none was previously stashed */
  getValidToken?: () => string | Promise<string>;
  /** Default cookie lifetime (seconds) */
  defaultMaxAgeSec?: number;
};

function getCookie(name: string) {
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : undefined;
}

function setCookie(name: string, value: string, maxAgeSec = 60 * 60 * 24) {
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    `Path=/`,
    `Max-Age=${maxAgeSec}`,
    `SameSite=Lax`,
    ...(location.protocol === "https:" ? ["Secure"] : []),
  ];
  document.cookie = parts.join("; ");
}

export function installDevTools(opts: InstallOptions = {}) {
  const tokenName = opts.tokenName ?? "authToken";
  const defaultMaxAgeSec = opts.defaultMaxAgeSec ?? 60 * 60 * 24;
  let lastKnownValidToken: string | undefined = (() => {
    const current = getCookie(tokenName);
    return current && current !== "expired-token-stub" ? current : undefined;
  })();

  const devTools: DevTools = {
    update: (...args) => console.log("[devTools.update]", ...args),

    auth: {
      token: () => getCookie(tokenName),

      setToken: (value, o) => {
        if (value !== "expired-token-stub") lastKnownValidToken = value;
        setCookie(tokenName, value, o?.maxAgeSec ?? defaultMaxAgeSec);
        console.info(`[devTools.auth] set ${tokenName}`);
      },

      invalidate: () => {
        const current = getCookie(tokenName);
        if (current && current !== "expired-token-stub") {
          lastKnownValidToken = current;
        }
        setCookie(tokenName, "expired-token-stub", 60); // short TTL by default
        console.info(`[devTools.auth] invalidated ${tokenName}`);
      },

      validate: async () => {
        let token = lastKnownValidToken;
        if (!token && opts.getValidToken) {
          token = await opts.getValidToken();
        }
        if (!token) {
          console.warn(
            `[devTools.auth] no valid token available; provide getValidToken() or call setToken() first`
          );
          return;
        }
        setCookie(tokenName, token, defaultMaxAgeSec);
        console.info(`[devTools.auth] restored ${tokenName}`);
      },
    },

    after: (ms, fn) => window.setTimeout(fn, ms),
  };

  Object.defineProperty(window, "devTools", {
    value: devTools,
    writable: false,
    configurable: true,
  });
  (window as any).dt = devTools;

  console.info(
    "%cdevTools ready → window.devTools / window.dt",
    "color:#22c55e"
  );
}
