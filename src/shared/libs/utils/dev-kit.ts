type DevKit = {
  auth: {
    token: () => string | undefined;
    setToken: (value: string, opts?: { maxAgeSec?: number }) => void;
    invalidate: () => void;
    validate: () => Promise<void>;
  };
  after: (ms: number, fn: () => void) => number;
};

const TOKEN_NAME = "authToken";
const TOKEN_STUB = "invalid-auth-token";
const DAY_SEC = 60 * 60 * 24;

export function installDevKit() {
  if (typeof window === "undefined") return undefined; // SSR guard
  if ((window as any).devKit) return (window as any).devKit as DevKit; // already installed

  const defaultMaxAgeSec = DAY_SEC;
  const cookieDefaults = {
    path: "/",
    sameSite: "Lax" as const,
    secure: location.protocol === "https:",
  };

  let lastKnownValidToken: string | undefined = (() => {
    const current = getCookie(TOKEN_NAME);
    return current && current !== TOKEN_STUB ? current : undefined;
  })();

  const devKit: DevKit = {
    auth: {
      token: () => getCookie(TOKEN_NAME),

      setToken: (value, o) => {
        if (value !== TOKEN_STUB) lastKnownValidToken = value;
        setCookie(TOKEN_NAME, value, {
          maxAgeSec: o?.maxAgeSec ?? defaultMaxAgeSec,
          ...cookieDefaults,
        });
        console.info(`[devKit.auth] set ${TOKEN_NAME}`);
      },

      invalidate: () => {
        const current = getCookie(TOKEN_NAME);
        if (current && current !== TOKEN_STUB) {
          lastKnownValidToken = current;
        }
        setCookie(TOKEN_NAME, TOKEN_STUB, { maxAgeSec: 60, ...cookieDefaults }); // short TTL by default
        console.info(`[devKit.auth] invalidated ${TOKEN_NAME}`);
      },

      validate: async () => {
        const token = lastKnownValidToken;
        if (!token) {
          console.warn(`[devKit.auth] no valid token; call setToken() first`);
          return;
        }
        setCookie(TOKEN_NAME, token, {
          maxAgeSec: defaultMaxAgeSec,
          ...cookieDefaults,
        });
        console.info(`[devKit.auth] restored ${TOKEN_NAME}`);
      },
    },

    /**
     * Dev helper: run a callback after `ms`.
     *
     * Uses:
     * - simulate latency
     * - schedule token flips
     *
     * Returns: timer id (use `clearTimeout(id)` to cancel)
     *
     * Example:
     *   const id = devKit.after(60_000, () => devKit.auth.invalidate());
     *   // clearTimeout(id)
     */
    after: (ms, fn) => window.setTimeout(fn, ms),
  };

  Object.defineProperty(window, "devKit", {
    value: devKit,
    writable: false,
    configurable: true,
  });
  (window as any).dk = devKit;

  console.info("%cdevKit ready → window.devKit / window.dk", "color:#22c55e");
  return devKit;
}

function getCookie(name: string) {
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1] ?? "") : undefined;
}

function setCookie(
  name: string,
  value: string,
  {
    maxAgeSec = DAY_SEC,
    path = "/",
    sameSite = "Lax",
    secure = location.protocol === "https:",
  }: {
    maxAgeSec?: number;
    path?: string;
    sameSite?: "Lax" | "Strict" | "None";
    secure?: boolean;
  } = {}
) {
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    `Path=${path}`,
    `Max-Age=${maxAgeSec}`,
    `SameSite=${sameSite}`,
    ...(secure ? ["Secure"] : []),
  ];
  document.cookie = parts.join("; ");
}
