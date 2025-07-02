import { useEffect, useRef } from "react";

export function useTraceUpdate({
  props,
  componentName = "Component",
}: {
  props: any;
  componentName: string;
}) {
  const prev = useRef(props);
  useEffect(() => {
    const changedProps = Object.entries(props).reduce(
      (prevProps, [key, value]) => {
        if (prev.current[key] !== value) {
          return { ...prevProps, [key]: [prev.current[key], value] };
        }
        return prevProps;
      },
      {}
    );

    const visualDelimiter = "=".repeat(70);
    const now = new Date();
    const timestamp = now.toISOString().replace("T", " ").split(".")[0]!;

    if (Object.keys(changedProps).length > 0) {
      console.log(visualDelimiter);
      console.warn(`Updated (${timestamp}): ${componentName}`);
      console.log("Changed props:", changedProps);
      console.log(visualDelimiter);
    }

    prev.current = props;
  });
}
