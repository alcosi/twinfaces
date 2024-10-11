import { useContext } from "react";
import { TwinContext } from "../twin-context";

export function TwinClassGeneral() {
  const { twinId } = useContext(TwinContext);

  return (
    <>
      <h2 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
        General
      </h2>
      <div>
        <h3>{twinId}</h3>
      </div>
    </>
  );
}
