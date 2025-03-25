import { Button } from "@/shared/ui";

import { ColorPicker } from "../color-picker";
import { SizePicker } from "../size-picker";

type Size = {
  name: string;
  inStock: boolean;
};

type Color = {
  name: string;
  class: string;
  selectedClass: string;
};

type ProductOptionsProps = {
  sizes: Size[];
  selectedSize?: Size;
  onSelectSize: (size: Size) => void;
  colors: Color[];
  selectedColor?: Color;
  onSelectColor: (color: Color) => void;
};

export const ProductOptions = ({
  sizes,
  selectedSize,
  onSelectSize,
  colors,
  selectedColor,
  onSelectColor,
}: ProductOptionsProps) => {
  return (
    <form className="mt-10">
      <ColorPicker
        colors={colors}
        selectedColor={selectedColor}
        onSelect={onSelectColor}
      />

      <SizePicker
        sizes={sizes}
        selectedSize={selectedSize}
        onSelect={onSelectSize}
      />

      <Button
        onClick={(e) => e.preventDefault()}
        type="submit"
        className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-primary hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden"
      >
        Add to cart
      </Button>
    </form>
  );
};
