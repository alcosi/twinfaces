"use client";

import { X } from "lucide-react";
import {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

import { FactoryCascade, useFetchFactoryCascade } from "@/entities/factory";
import { FactoryContext } from "@/features/factory";
import { cn } from "@/shared/libs";
import { Button } from "@/shared/ui";
import { LoadingOverlay } from "@/shared/ui/loading";

import {
  FactoryCreateTarget,
  FactoryGraphSelection,
  buildFactoryTreeDiagram,
  buildNodeViewDiagram,
  getNodeViewTitle,
  indexCascade,
} from "./model";
import {
  FactoryCreateSheets,
  FactoryCreateSheetsRef,
  FactoryDiagram,
} from "./ui";

/**
 * The factory Graph tab. Two side-by-side panels: the Factory tree on the left
 * always shows the current factory's cascade, and the Node view on the right
 * expands whatever element is selected in it — splitting the space in half
 * while it is open.
 */
export function FactoryGraph() {
  const { factoryId } = useContext(FactoryContext);
  const { fetchFactoryCascade, loading } = useFetchFactoryCascade();
  const [cascade, setCascade] = useState<FactoryCascade | undefined>(undefined);
  const [selection, setSelection] = useState<FactoryGraphSelection | undefined>(
    undefined
  );
  const createSheetsRef = useRef<FactoryCreateSheetsRef>(null);

  const refresh = useCallback(async () => {
    try {
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

  const treeDiagram = useMemo(
    () => (index ? buildFactoryTreeDiagram(index) : undefined),
    [index]
  );

  const nodeViewDiagram = useMemo(
    () =>
      index && selection ? buildNodeViewDiagram(index, selection) : undefined,
    [index, selection]
  );

  const handleCreate = useCallback((target: FactoryCreateTarget) => {
    createSheetsRef.current?.open(target);
  }, []);

  const handleSelect = useCallback((next: FactoryGraphSelection) => {
    setSelection(next);
  }, []);

  const isNodeViewOpen = Boolean(nodeViewDiagram && selection);

  return (
    // The tab body is not height-constrained by TabsLayout, and React Flow needs
    // a real height — so the canvas area is sized off the viewport, the same way
    // the twin class Graph tab does it. `relative` anchors the refresh overlay.
    <div className="relative flex h-[calc(100vh-240px)] min-h-[680px] w-full flex-row gap-2 py-2">
      {(loading || !index || !treeDiagram) && <LoadingOverlay />}

      {index && treeDiagram && (
        <>
          {/* Both panels are flex-1, so opening the Node view splits the width
              in half and closing it hands the space back to the tree. */}
          <Panel title="Factory tree" className="flex-1">
            <FactoryDiagram
              diagram={treeDiagram}
              selection={selection}
              onSelect={handleSelect}
              onCreate={handleCreate}
            />
          </Panel>

          {isNodeViewOpen && selection && nodeViewDiagram && (
            <Panel
              title={`Node view — ${getNodeViewTitle(index, selection)}`}
              className="flex-1"
              onClose={() => setSelection(undefined)}
            >
              <FactoryDiagram
                diagram={nodeViewDiagram}
                onSelect={handleSelect}
                onCreate={handleCreate}
                emptyMessage="This element has nothing to expand yet."
              />
            </Panel>
          )}
        </>
      )}

      <FactoryCreateSheets ref={createSheetsRef} onCreated={refresh} />
    </div>
  );
}

function Panel({
  title,
  className,
  onClose,
  children,
}: {
  title: string;
  className?: string;
  onClose?: () => void;
  children: ReactNode;
}) {
  return (
    <section
      className={cn(
        // `min-w-0` lets the panel shrink past its content inside the row, so
        // two open panels really do split the width instead of overflowing.
        "border-border flex min-h-0 min-w-0 flex-col overflow-hidden rounded-md border",
        className
      )}
    >
      <header className="border-border bg-muted/40 flex shrink-0 items-center justify-between border-b px-3 py-2">
        <h3 className="truncate text-sm font-medium">{title}</h3>
        {onClose && (
          <Button variant="ghost" size="iconS6" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </header>
      <div className="min-h-0 flex-1">{children}</div>
    </section>
  );
}
