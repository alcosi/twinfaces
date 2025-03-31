import { isPopulatedString } from "@/shared/libs";

type CookieOptions = {
  path?: string;
  expires?: Date | number | string;
  sameSite?: "Lax" | "Strict" | "None";
  secure?: boolean;
};

function serialize(
  name: string,
  value: string,
  options: CookieOptions = {}
): string {
  const encoded = encodeURIComponent(value);
  const segments = [`${name}=${encoded}`];

  if (options.path) segments.push(`Path=${options.path}`);
  if (options.expires) {
    const expires = isPopulatedString(options.expires)
      ? options.expires
      : new Date(options.expires).toUTCString();
    segments.push(`Expires=${expires}`);
  }
  if (options.sameSite) segments.push(`SameSite=${options.sameSite}`);
  if (options.secure) segments.push(`Secure`);

  return segments.join("; ");
}

function set(name: string, value: string, options?: CookieOptions) {
  document.cookie = serialize(name, value, options);
}

function get(name: string): string | undefined {
  const cookies = document.cookie
    .split("; ")
    .map((c) => c.split("="))
    .reduce(
      (acc, [key, val]) => {
        acc[key!] = val ?? "";
        return acc;
      },
      {} as Record<string, string>
    );

  return cookies[name];
}

function remove(name: string, path = "/") {
  set(name, "", {
    path,
    expires: new Date(0),
  });
}

export const clientCookies = {
  set,
  get,
  remove,
};
