import { PropsWithChildren, ReactNode, isValidElement } from "react";

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

  const normalizedChildren = Array.isArray(children) ? children : [children];
  const columns: ReactNode[][] = Array.from({ length: colCount }, () =>
    Array.from({ length: normalizedChildren.length })
  );

  normalizedChildren.forEach((child, index) => {
    if (!isValidElement(child)) return;

    const childClassName =
      (child.props as { className?: string })?.className ?? "";
    const { columnIndex, rowIndex } = parseGridPlacement(childClassName);

    // NOTE: use the parsed columnIndex if provided, otherwise fallback to [round-robin](https://en.wikipedia.org/wiki/Round-robin_scheduling)
    const distributedColIndex = isNumber(columnIndex)
      ? columnIndex
      : index % colCount;
    const targetColumn = columns[distributedColIndex];

    if (!targetColumn) return;

    const testId = `col-${distributedColIndex + 1} : row-${isNumber(rowIndex) ? rowIndex + 1 : undefined}`;
    const item = (
      <Masonry.Item key={testId} testId={testId}>
        {child}
      </Masonry.Item>
    );

    if (isNumber(rowIndex) && rowIndex < targetColumn.length) {
      targetColumn[rowIndex] = item;
    } else {
      targetColumn.push(item);
    }
  });

  return (
    <Masonry.Grid colCount={colCount} className={className}>
      {columns.map((col, i) => (
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

  const columnIndex =
    colMatch && colMatch[1] ? parseInt(colMatch[1], 10) - 1 : undefined;
  const rowIndex =
    rowMatch && rowMatch[1] ? parseInt(rowMatch[1], 10) - 1 : undefined;

  return {
    columnIndex: isFinite(columnIndex!) ? columnIndex : undefined,
    rowIndex: isFinite(rowIndex!) ? rowIndex : undefined,
  };
}
