import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";

import { fetchTwidget2Face } from "@/entities/face";
import { safe } from "@/shared/libs";

import { AlertError } from "../../alert-error";
import { TWidgetProps } from "../types";

export async function TW002({ widgetFaceId, twinId }: TWidgetProps) {
  const result = await safe(() => fetchTwidget2Face(widgetFaceId, twinId));

  if (!result.ok) {
    return <AlertError message="Widget TW002 failed to load." />;
  }

  return (
    <Accordion type="single" collapsible className="w-full" defaultValue="EN">
      <AccordionItem key="EN" value="EN">
        <AccordionTrigger>EN</AccordionTrigger>
        <AccordionContent>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore
            provident non earum! Quae iste distinctio facilis, aperiam
            cupiditate enim tenetur, voluptate ab quibusdam nostrum nulla ea
            quia molestias. Cumque, officiis.
          </p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem key="RU" value="RU">
        <AccordionTrigger>RU</AccordionTrigger>
        <AccordionContent>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore
            provident non earum! Quae iste distinctio facilis, aperiam
            cupiditate enim tenetur, voluptate ab quibusdam nostrum nulla ea
            quia molestias. Cumque, officiis.
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
