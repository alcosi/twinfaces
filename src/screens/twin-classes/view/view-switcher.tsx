export type TwinClassesView = "table" | "extendsTree" | "headTree";

export function ViewSwitcher({
  value,
  onChange,
}: {
  value: TwinClassesView;
  onChange: (v: TwinClassesView) => void;
}) {
  return (
    <div className="mb-4 flex gap-2">
      <button
        className={`rounded border px-3 py-1.5 text-sm ${
          value === "table"
            ? "bg-primary text-primary-foreground"
            : "hover:bg-muted"
        }`}
        onClick={() => onChange("table")}
      >
        Table view
      </button>

      <button
        className={`rounded border px-3 py-1.5 text-sm ${
          value === "extendsTree"
            ? "bg-primary text-primary-foreground"
            : "hover:bg-muted"
        }`}
        onClick={() => onChange("extendsTree")}
      >
        Extends tree view
      </button>

      <button
        className={`rounded border px-3 py-1.5 text-sm ${
          value === "headTree"
            ? "bg-primary text-primary-foreground"
            : "hover:bg-muted"
        }`}
        onClick={() => onChange("headTree")}
      >
        Head tree view
      </button>
    </div>
  );
}
