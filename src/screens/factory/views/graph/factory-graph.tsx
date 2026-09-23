"use client";

import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

import {
  FactoryCascade,
  useFetchFactoryCascade,
  useFetchFactoryUsages,
} from "@/entities/factory";
import { FactoryContext } from "@/features/factory";
import { cn } from "@/shared/libs";
import { LoadingOverlay } from "@/shared/ui/loading";

import {
  FactoryCreateTarget,
  GraphChip,
  GraphMode,
  buildCallersFromUsages,
  buildFactoryGraph,
  indexCascade,
  mergeCallers,
} from "./model";
import {
  FactoryCreateSheets,
  FactoryCreateSheetsRef,
  FactoryDiagram,
} from "./ui";

const MODES: { value: GraphMode; label: string }[] = [
  { value: "simple", label: "Simple" },
  { value: "advanced", label: "Advanced" },
];

/**
 * The factory Graph tab. One canvas, drawn at the level of detail the mode
 * switch picks: `Simple` is the skeleton of factories, multipliers, pipelines
 * and branches, `Advanced` unfolds every card into the entities it is made of.
 */
export function FactoryGraph() {
  const { factoryId } = useContext(FactoryContext);
  const { fetchFactoryCascade, loading } = useFetchFactoryCascade();
  const { fetchFactoryUsages } = useFetchFactoryUsages();
  const [cascade, setCascade] = useState<FactoryCascade | undefined>(undefined);
  const [callers, setCallers] = useState<Map<string, GraphChip[]> | undefined>(
    undefined
  );
  const [mode, setMode] = useState<GraphMode>("simple");
  const createSheetsRef = useRef<FactoryCreateSheetsRef>(null);

  const refresh = useCallback(async () => {
    try {
      // Dropped rather than kept across a reload: they belong to the cascade
      // that is being replaced, and a caller that has just been deleted would
      // otherwise stay on the card until the new usages arrive.
      setCallers(undefined);
      setCascade(await fetchFactoryCascade(factoryId));
    } catch (error) {
      console.error("Failed to fetch the factory cascade:", error);
      toast.error("Failed to load the factory graph");
    }
  }, [factoryId, fetchFactoryCascade]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const index = useMemo(
    () => (cascade ? indexCascade(cascade) : undefined),
    [cascade]
  );

  // A factory view reports the usages of the factory it was asked for and of no
  // other, so the cascade can only fill the root card's "Called From". The rest
  // of the canvas is covered by one search over every factory it draws.
  useEffect(() => {
    if (!index) return;

    let cancelled = false;

    fetchFactoryUsages([...index.factories.keys()])
      .then((usages) => {
        if (!cancelled) setCallers(buildCallersFromUsages(usages));
      })
      .catch((error) => {
        // A missing "Called From" block is not worth failing the graph over.
        console.error("Failed to fetch the factories' usages:", error);
      });

    return () => {
      cancelled = true;
    };
  }, [index, fetchFactoryUsages]);

  const indexWithCallers = useMemo(() => {
    if (!index || !callers) return index;

    return {
      ...index,
      callersByFactoryId: mergeCallers(index.callersByFactoryId, callers),
    };
  }, [index, callers]);

  const diagram = useMemo(
    () =>
      indexWithCallers ? buildFactoryGraph(indexWithCallers, mode) : undefined,
    [indexWithCallers, mode]
  );

  const handleCreate = useCallback((target: FactoryCreateTarget) => {
    createSheetsRef.current?.open(target);
  }, []);

  return (
    // The tab body is not height-constrained by TabsLayout, and React Flow needs
    // a real height — so the canvas area is sized off the viewport, the same way
    // the twin class Graph tab does it. `relative` anchors the mode switch and
    // the refresh overlay.
    <div className="border-border relative h-[calc(100vh-240px)] min-h-[680px] w-full overflow-hidden rounded-md border">
      {(loading || !diagram) && <LoadingOverlay />}

      {diagram && (
        <FactoryDiagram
          diagram={diagram}
          onCreate={handleCreate}
          emptyMessage="This factory has nothing to draw yet."
        />
      )}

      {/* Floats over the canvas rather than sitting above it: the graph is the
          whole tab, and a toolbar row would eat height it needs. */}
      <div className="bg-card border-border absolute top-3 right-3 z-10 flex gap-1 rounded-lg border p-1 shadow-sm">
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
      </div>

      <FactoryCreateSheets ref={createSheetsRef} onCreated={refresh} />
    </div>
  );
}
