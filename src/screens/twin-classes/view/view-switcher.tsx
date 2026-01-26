import { cn } from "@/shared/libs";

export type TwinClassesView = "table" | "extendsTree" | "headTree";

const OPTIONS: { value: TwinClassesView; label: string }[] = [
  { value: "table", label: "Table" },
  { value: "extendsTree", label: "Extends tree" },
  { value: "headTree", label: "Head tree" },
];

const INDEX_BY_VALUE: Record<TwinClassesView, number> = {
  table: 0,
  extendsTree: 1,
  headTree: 2,
};

export function ViewSwitcher({
  value,
  onChange,
}: {
  value: TwinClassesView;
  onChange: (v: TwinClassesView) => void;
}) {
  const activeIndex = INDEX_BY_VALUE[value];

  return (
    <div className="bg-muted border-border relative inline-grid grid-cols-3 rounded-lg border p-1">
      <div
        className="bg-background absolute inset-y-1 left-1 rounded-md shadow transition-transform duration-200 ease-out"
        style={{
          width: "calc(100% / 3 - 0.25rem)",
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      />

      {OPTIONS.map((opt) => {
        const active = opt.value === value;

        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "relative z-10 flex items-center justify-center px-3 py-1.5 text-sm font-medium transition-colors",
              active
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
