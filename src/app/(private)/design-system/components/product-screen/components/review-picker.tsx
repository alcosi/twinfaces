import { Star } from "lucide-react";

type ReviewProps = {
  reviews: {
    href: string;
    average: number;
    totalCount: number;
  };
};

export const ReviewPicker = ({ reviews }: ReviewProps) => {
  return (
    <div className="mt-6">
      <h3 className="sr-only">Reviews</h3>
      <div className="flex items-center">
        <div className="flex items-center">
          {[0, 1, 2, 3, 4].map((rating) => (
            <Star
              key={rating}
              aria-hidden="true"
              className={`size-5 shrink-0 ${
                reviews.average > rating
                  ? "text-foreground dark:text-yellow-400"
                  : "text-muted-foreground"
              }`}
            />
          ))}
        </div>
        <p className="sr-only">{reviews.average} out of 5 stars</p>
        <a
          href={reviews.href}
          className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          {reviews.totalCount} reviews
        </a>
      </div>
    </div>
  );
};
