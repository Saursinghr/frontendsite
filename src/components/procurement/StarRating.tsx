
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  onRatingChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
}

export const StarRating = ({
  rating,
  maxRating = 5,
  onRatingChange,
  size = 'md',
  readonly = false,
}: StarRatingProps) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseEnter = (idx: number) => {
    if (readonly) return;
    setHoverRating(idx);
  };

  const handleMouseLeave = () => {
    if (readonly) return;
    setHoverRating(0);
  };

  const handleClick = (idx: number) => {
    if (readonly) return;
    onRatingChange?.(idx);
  };

  const starSizeClass = {
    'sm': 'w-3.5 h-3.5',
    'md': 'w-5 h-5',
    'lg': 'w-6 h-6',
  }[size];

  return (
    <div className="flex items-center">
      {[...Array(maxRating)].map((_, idx) => {
        const starValue = idx + 1;
        const isFilled = hoverRating ? hoverRating >= starValue : rating >= starValue;
        
        return (
          <span
            key={idx}
            className={cn(
              "cursor-default transition-all",
              !readonly && "cursor-pointer",
              "inline-block"
            )}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(starValue)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={isFilled ? "#f59e0b" : "none"}
              stroke={isFilled ? "#f59e0b" : "#d1d5db"}
              strokeWidth="1.5"
              className={cn(
                "transition-colors",
                starSizeClass,
                "mr-0.5"
              )}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
          </span>
        );
      })}
      <span className="ml-2 text-sm text-muted-foreground">
        {rating.toFixed(1)}
      </span>
    </div>
  );
};
