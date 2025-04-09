type ProductNameProps = {
  name: string;
};

export const ProductName = ({ name }: ProductNameProps) => {
  return (
    <div className="lg:col-span-2 lg:pr-8">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl dark:text-primary">
        {name}
      </h1>
    </div>
  );
};
