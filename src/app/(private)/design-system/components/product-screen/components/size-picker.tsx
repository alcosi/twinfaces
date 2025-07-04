type Size = {
  name: string;
  inStock: boolean;
};

type SizePickerProps = {
  sizes: Size[];
  selectedSize?: Size;
  onSelect: (size: Size) => void;
};

export const SizePicker = ({
  sizes,
  selectedSize,
  onSelect,
}: SizePickerProps) => {
  return (
    <div className="mt-10">
      <div className="flex items-center justify-between">
        <h3 className="dark:text-primary text-sm font-medium text-gray-900">
          Size
        </h3>
        <a
          href="#"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Size guide
        </a>
      </div>

      <fieldset aria-label="Choose a size" className="mt-4">
        <div className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4">
          {sizes.map((size) => {
            const isSelected = selectedSize?.name === size.name;

            return (
              <button
                key={size.name}
                type="button"
                onClick={() => size.inStock && onSelect(size)}
                disabled={!size.inStock}
                aria-pressed={isSelected}
                className={`relative flex items-center justify-center rounded-md border px-4 py-3 text-sm font-medium uppercase transition-all ${
                  size.inStock
                    ? "bg-bg-background dark:text-primary cursor-pointer text-gray-900 shadow-xs hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
                    : "cursor-not-allowed bg-gray-50 text-gray-200 dark:bg-gray-700 dark:text-gray-500"
                } ${
                  isSelected
                    ? "border-indigo-500 ring-2 ring-indigo-500 dark:border-indigo-400 dark:ring-indigo-400"
                    : ""
                } `}
              >
                <span>{size.name}</span>
              </button>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
};
