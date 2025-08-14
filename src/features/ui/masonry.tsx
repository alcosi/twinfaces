import {
  Children,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  cloneElement,
  isValidElement,
} from "react";

import { isNumber } from "@/shared/libs";
import { Masonry } from "@/shared/ui/masonry";

export function MasonryLayout({
  className,
  children,
}: PropsWithChildren<{
  className?: string;
}>) {
  const isMasonry = className?.includes("grid-rows-masonry");

  if (!isMasonry) {
    return <div className={className}>{children}</div>;
  }

  const { colCount, layoutClassNames } = analyzeClassName(className);

  type ColItem = { node: ReactNode; rowIndex: number; order: number };
  const columns: ColItem[][] = Array.from({ length: colCount }, () => []);

  const normalizedChildren = Children.toArray(children);

  normalizedChildren.forEach((child, index) => {
    if (!isValidElement(child)) return;

    const childClassName =
      (child.props as { className?: string })?.className ?? "";
    const { columnIndex: col0, rowIndex: row0 } =
      parseGridPlacement(childClassName);

    const { restClasses } = splitLayoutAndRest(childClassName);

    // NOTE: use the parsed columnIndex if provided, otherwise fallback to [round-robin](https://en.wikipedia.org/wiki/Round-robin_scheduling)
    const distributedColIndex = isNumber(col0) ? col0 : index % colCount;
    const targetColumn = columns[distributedColIndex];
    if (!targetColumn) return;

    const childWithRest = cloneElement(
      child as ReactElement<{ className?: string }>,
      { className: restClasses || undefined }
    );

    const rowIndex = isNumber(row0) ? row0 : Number.POSITIVE_INFINITY;

    const itemNode = (
      <Masonry.Item
        key={index}
        className="relative"
        col={distributedColIndex + 1}
        row={isFinite(rowIndex) ? rowIndex + 1 : undefined}
      >
        {childWithRest}
      </Masonry.Item>
    );

    targetColumn.push({ node: itemNode, rowIndex, order: index });
  });

  const sortedCols = columns.map((col) =>
    col
      .sort((a, b) =>
        a.rowIndex === b.rowIndex ? a.order - b.order : a.rowIndex - b.rowIndex
      )
      .map((x) => x.node)
  );

  const gridClass = `grid grid-cols-${colCount}`;

  return (
    <Masonry.Grid
      colCount={colCount}
      className={`${gridClass} ${className ?? ""}`}
    >
      {sortedCols.map((col, i) => (
        <Masonry.Column key={i} className={layoutClassNames}>
          {col}
        </Masonry.Column>
      ))}
    </Masonry.Grid>
  );
}

type AnalyzedClassName = {
  colCount: number;
  layoutClassNames: string;
  restClassNames: string;
};

function analyzeClassName(className?: string | string[]): AnalyzedClassName {
  const colRegex = /(?:^|\s)(?:\w+:)?grid-cols-(\d+)/g;
  const layoutPatterns = [/^gap(-[xy]?)?-/, /^space-[xy]-/];

  const classList = Array.isArray(className)
    ? className.join(" ").split(/\s+/)
    : (className ?? "").split(/\s+/);

  let colCount = 1;
  const layout: string[] = [];
  const rest: string[] = [];

  for (const cls of classList) {
    if (layoutPatterns.some((pattern) => pattern.test(cls))) {
      layout.push(cls);
    } else if (colRegex.test(cls)) {
      const match = cls.match(/grid-cols-(\d+)/);

      if (match) {
        colCount = match[1] ? parseInt(match[1], 10) : colCount;
      }

      rest.push(cls);
    } else {
      rest.push(cls);
    }
  }

  return {
    colCount,
    layoutClassNames: layout.join(" "),
    restClassNames: rest.join(" "),
  };
}

function parseGridPlacement(className?: string): {
  columnIndex?: number;
  rowIndex?: number;
} {
  if (!className) return {};
  const colMatch = className.match(/col-start-(\d+)/);
  const rowMatch = className.match(/row-start-(\d+)/);
  const columnIndex = colMatch?.[1] ? parseInt(colMatch[1], 10) - 1 : undefined;
  const rowIndex = rowMatch?.[1] ? parseInt(rowMatch[1], 10) - 1 : undefined;
  return {
    columnIndex: Number.isFinite(columnIndex!) ? columnIndex : undefined,
    rowIndex: Number.isFinite(rowIndex!) ? rowIndex : undefined,
  };
}

function splitLayoutAndRest(className?: string) {
  const parts = (className ?? "").split(/\s+/).filter(Boolean);
  const isPlace = (c: string) =>
    /^col-start-\d+$/.test(c) || /^row-start-\d+$/.test(c);
  const restClasses = parts.filter((c) => !isPlace(c)).join(" ");
  return { restClasses };
}
