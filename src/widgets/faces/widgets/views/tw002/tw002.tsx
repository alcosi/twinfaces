import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";

import { fetchTW002Face } from "@/entities/face";
import { withRedirectOnUnauthorized } from "@/features/auth";
import { safe } from "@/shared/libs";

import { StatusAlert } from "../../../components";
import { TWidgetFaceProps } from "../../types";

export async function TW002(props: TWidgetFaceProps) {
  const { twinId, face, widget } = props;

  const result = await safe(
    withRedirectOnUnauthorized(() =>
      fetchTW002Face(widget.widgetFaceId, twinId)
    )
  );

  if (!result.ok) {
    return (
      <StatusAlert variant="error" message="Widget TW002 failed to load." />
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
