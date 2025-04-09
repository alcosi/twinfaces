import { useState } from "react";

import {
  ProductDescription,
  ProductName,
  ProductOptions,
  ProductPrice,
  ReviewPicker,
} from "./components";
import { products } from "./data";

export function ProductsScreen() {
  const [selectedColor, setSelectedColor] = useState(products[0]?.colors[0]);
  const [selectedSize, setSelectedSize] = useState(products[0]?.sizes[1]);

  return (
    <div className="min-h-screen flex justify-center items-center dark:bg-background">
      <div className="w-full max-w-7xl px-4">
        {products.map((product, index) => (
          <div
            key={index}
            className="flex flex-col lg:flex-row lg:gap-8 lg:px-8"
          >
            <div className="lg:w-2/3 max-w-2xl px-4 pt-10 pb-16 sm:px-6 lg:pt-16 lg:pb-24">
              <ProductName name={product.name} />

              <div className="mt-4 lg:mt-0">
                <ProductPrice price={product.price} />

                <ReviewPicker reviews={product.reviews} />

                <ProductOptions
                  sizes={product.sizes}
                  selectedSize={selectedSize}
                  onSelectSize={setSelectedSize}
                  colors={product.colors}
                  selectedColor={selectedColor}
                  onSelectColor={setSelectedColor}
                />
              </div>

              <div className="py-10 lg:pt-6 lg:pr-8 lg:pb-16">
                <ProductDescription product={product} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
