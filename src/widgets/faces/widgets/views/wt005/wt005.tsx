import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";

import { fetchWT005Face } from "@/entities/face";
import { withRedirectOnUnauthorized } from "@/features/auth";
import { safe } from "@/shared/libs";

import { StatusAlert } from "../../../components";
import { WidgetFaceProps } from "../../types";

export async function WT005(props: WidgetFaceProps) {
  const { twinId, face, widget } = props;

  const result = await safe(
    withRedirectOnUnauthorized(() =>
      fetchWT005Face(widget.widgetFaceId, twinId)
    )
  );

  if (!result.ok) {
    return (
      <StatusAlert variant="error" message="Widget WT005 failed to load." />
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full" defaultValue="EN">
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
