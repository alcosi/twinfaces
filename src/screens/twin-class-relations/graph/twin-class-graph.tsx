"use client";

import { useCallback, useContext, useMemo, useRef, useState } from "react";

import { TwinClassContext } from "@/entities/twin-class";
import { cn } from "@/shared/libs";
import { Switch } from "@/shared/ui";
import { LoadingOverlay } from "@/shared/ui/loading";

import {
  GraphMode,
  LinkSide,
  layoutClassGraph,
  useClassGraphData,
} from "./model";
import { ClassDiagram, CreateLinkDialog, CreateLinkDialogRef } from "./ui";

const MODES: { value: GraphMode; label: string }[] = [
  { value: "simple", label: "Simple" },
  { value: "advanced", label: "Advanced" },
];

/**
 * The twin class Graph tab: the class in the middle, its head above, its
 * children below, backward links to the left and forward links to the right.
 *
 * `Simple` draws one compact card per class, `Advanced` unfolds each into its
 * fields and statuses. Every line is captioned with the relation it stands
 * for; "Link labels" also puts each link itself on its branch.
 */
export function TwinClassRelationsGraph() {
  const { twinClassId, twinClass } = useContext(TwinClassContext);
  const { data, loading, reload } = useClassGraphData(twinClassId, twinClass);
  const [mode, setMode] = useState<GraphMode>("simple");
  const [showLinkLabels, setShowLinkLabels] = useState(false);
  const createLinkRef = useRef<CreateLinkDialogRef>(null);

  const layout = useMemo(
    () => (data ? layoutClassGraph(data, { mode, showLinkLabels }) : undefined),
    [data, mode, showLinkLabels]
  );

  const handleCreate = useCallback((side: LinkSide) => {
    createLinkRef.current?.open(side);
  }, []);

  return (
    // The tab body is not height-constrained by TabsLayout, and React Flow needs
    // a real height — so the canvas is sized off the viewport, the same way the
    // factory Graph tab does it.
    <div className="border-border bg-background relative h-[calc(100vh-240px)] min-h-[680px] w-full overflow-hidden rounded-md border">
      {loading && <LoadingOverlay />}

      {layout && (
        <ClassDiagram layout={layout} mode={mode} onCreate={handleCreate} />
      )}

      {/* Floats over the canvas rather than sitting above it: the graph is the
          whole tab, and a toolbar row would eat height it needs. */}
      <div className="bg-card border-border absolute top-3 right-3 z-10 flex items-center gap-1 rounded-lg border p-1 shadow-sm">
        {MODES.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setMode(item.value)}
            className={cn(
              "rounded-md px-3 py-1 text-xs font-medium transition-colors",
              mode === item.value
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {item.label}
          </button>
        ))}

        <span aria-hidden className="bg-border mx-2 h-5 w-px" />

        <label className="flex cursor-pointer items-center gap-2 pr-1 text-xs font-medium">
          Link labels
          <Switch
            checked={showLinkLabels}
            onCheckedChange={setShowLinkLabels}
            ignorePermissions
          />
        </label>
      </div>

      <CreateLinkDialog
        ref={createLinkRef}
        twinClassId={twinClassId}
        onCreated={reload}
      />
    </div>
  );
}
