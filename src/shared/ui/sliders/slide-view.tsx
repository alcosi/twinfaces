import { css } from "@emotion/css";
import { Children, PropsWithChildren } from "react";

import { cn } from "@/shared/libs";

type Props = PropsWithChildren<{
  activeIndex: number;
  className?: string;
}>;

const BASE_SLIDE_STYLE =
  "absolute h-full w-full top-0 transition-transform duration-300 ease-in-out";

export function SlideView({ children, activeIndex, className }: Props) {
  const slides = Children.toArray(children);

  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      {slides.map((child, index) => {
        const offset = (index - activeIndex) * 100;
        const style = css`
          transform: translateX(${offset}%);
        `;

        return (
          <div key={index} className={cn(BASE_SLIDE_STYLE, style)}>
            {child}
          </div>
        );
      })}
    </div>
  );
}
