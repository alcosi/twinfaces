type Color = {
  name: string;
  class: string;
  selectedClass: string;
};

type ColorPickerProps = {
  colors: Color[];
  selectedColor?: Color;
  onSelect: (color: Color) => void;
};

export const ColorPicker = ({
  colors,
  selectedColor,
  onSelect,
}: ColorPickerProps) => {
  return (
    <>
      <h3 className="dark:text-primary text-sm font-medium text-gray-900">
        Color
      </h3>
      <fieldset aria-label="Choose a color" className="mt-4">
        <div className="flex items-center gap-x-3">
          {colors.map((color) => (
            <button
              key={color.name}
              type="button"
              onClick={() => onSelect(color)}
              aria-label={color.name}
              aria-pressed={selectedColor?.name === color.name}
              className={`relative flex items-center justify-center rounded-full p-1 transition-all ${
                selectedColor?.name === color.name
                  ? `${color.selectedClass} dark:ring-primary ring-2 ring-gray-600`
                  : "ring-0"
              }`}
            >
              <span
                aria-hidden="true"
                className={`dark:border-primary/20 border-foreground/10 block size-8 rounded-full border ${color.class}`}
              />
            </button>
          ))}
        </div>
      </fieldset>
    </>
  );
};
