import { PageProps, PermissionPage } from "@/screens/permission";

export default function Page(props: PageProps) {
  return (
    <PermissionPage /* @next-codemod-error 'props' is used with spread syntax (...). Any asynchronous properties of 'props' must be awaited when accessed. */
      {...props}
    />
  );
}
