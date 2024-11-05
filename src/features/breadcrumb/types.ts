export type Breadcrumb = {
  label: string;
  href: string;
};

export type Context = {
  breadcrumbs: Breadcrumb[];
  setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void;
};
