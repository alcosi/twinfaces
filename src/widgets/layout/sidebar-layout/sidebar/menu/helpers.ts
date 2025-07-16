export function isItemActive(url: string, pathname: string) {
  return new RegExp(`^${url}(/|$)`).test(pathname);
}
