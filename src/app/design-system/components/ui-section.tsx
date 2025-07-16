import { PropsWithChildren, ReactNode } from "react";

import { Card } from "@/shared/ui";

type Props = {
  title: string;
  className?: string;
} & PropsWithChildren;

export function UiSection({
  title,
  className = "grid grid-cols-2 md:grid-cols-4 gap-4",
  children,
}: Props) {
  return (
    <section className="">
      <h1 className="font-bold mb-3">{title}</h1>
      <main className={className}>{children}</main>
    </section>
  );
}

UiSection.Item = function Item({
  title,
  value,
}: {
  title: string;
  value: ReactNode;
}) {
  return (
    <Card className="py-2 px-4 col-span-2">
      <h2>{title}</h2>
      <div className="">{value}</div>
    </Card>
  );
};
