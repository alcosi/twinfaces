/**
 * Represents a single breadcrumb item in the breadcrumb navigation.
 *
 * Consider adding a `key` field in the future to uniquely identify
 * each breadcrumb, facilitating more flexible operations.
 */
export type Breadcrumb = {
  label: string;
  href: string;
};

/**
 * Represents the context for managing breadcrumb navigation state.
 *
 * Currently, users can only set breadcrumbs using the `setBreadcrumbs`
 * method, which enforces a stricter approach and minimizes errors.
 * Future enhancements may include adding methods like `push`, `replace`,
 * and `clear` for improved functionality and flexibility in breadcrumb management.
 */
export type Context = {
  breadcrumbs: Breadcrumb[];
  setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void;
};
