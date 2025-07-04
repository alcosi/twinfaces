import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/ui";

type ProductDescriptionProps = {
  product: {
    description: { name: string; ln: string; text: string }[];
    highlights: { name: string; ln: string; text: string[] }[];
    details: { name: string; ln: string; text: string }[];
  };
};

export const ProductDescription = ({ product }: ProductDescriptionProps) => {
  const languages = Array.from(
    new Set(product.description.map((desc) => desc.ln))
  );

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      defaultValue={languages[0]}
    >
      {languages.map((ln) => {
        const description = product.description.find((desc) => desc.ln === ln);
        const highlights = product.highlights.find((high) => high.ln === ln);
        const details = product.details.find((det) => det.ln === ln);

        return (
          <AccordionItem key={ln} value={ln}>
            <AccordionTrigger>{ln.toUpperCase()}</AccordionTrigger>
            <AccordionContent>
              {description && (
                <div className="mb-6">
                  <h3 className="mb-4 text-sm font-medium text-gray-900 dark:text-gray-300">
                    {description.name}
                  </h3>
                  <p className="text-base text-gray-900 dark:text-gray-300">
                    {description.text}
                  </p>
                </div>
              )}

              {highlights && (
                <div className="mb-6">
                  <h3 className="mb-4 text-sm font-medium text-gray-900 dark:text-gray-300">
                    {highlights.name}
                  </h3>
                  <ul className="list-disc space-y-2 pl-4 text-sm text-gray-900 dark:text-gray-300">
                    {highlights.text.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {details && (
                <div>
                  <h3 className="mb-4 text-sm font-medium text-gray-900 dark:text-gray-300">
                    {details.name}
                  </h3>
                  <p className="text-sm text-gray-900 dark:text-gray-300">
                    {details.text}
                  </p>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};
