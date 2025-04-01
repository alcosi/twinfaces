import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";

import { fetchTW002Face } from "@/entities/face";
import { cn, safe } from "@/shared/libs";

import { AlertError } from "../../alert-error";
import { widgetGridClasses } from "../../layouts/utils";
import { TWidgetFaceProps } from "../types";

export async function TW002(props: TWidgetFaceProps) {
  const { twinId, face, widget } = props;

  const result = await safe(() => fetchTW002Face(widget.widgetFaceId, twinId));

  if (!result.ok) {
    return <AlertError message="Widget TW002 failed to load." />;
  }

  return (
    <Accordion
      type="single"
      collapsible
      className={(cn("w-full"), widgetGridClasses(widget))}
      defaultValue="EN"
    >
      <AccordionItem key="EN" value="EN">
        <AccordionTrigger>EN</AccordionTrigger>
        <AccordionContent>
          <p>{face.name}</p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem key="RU" value="RU">
        <AccordionTrigger>RU</AccordionTrigger>
        <AccordionContent>
          <p>{face.name}</p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
