/**
 * Represents a single breadcrumb item in the breadcrumb navigation.
 */
export type Breadcrumb = {
  label: string;
  href: string;
};

/**
 * Represents the context for managing breadcrumb navigation state.
 *
 * Users can only set breadcrumbs using the `setBreadcrumbs`
 * method, which enforces a stricter approach and minimizes errors.
 */
export type Context = {
  breadcrumbs: Breadcrumb[];
  setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void;
};
