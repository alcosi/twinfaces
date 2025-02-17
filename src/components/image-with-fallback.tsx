"use client";

import Image, { ImageProps } from "next/image";
import React, { useEffect, useState } from "react";

interface ImageWithFallbackProps extends ImageProps {
  fallbackContent?: React.ReactNode;
  fallbackSrc?: string;
  emptyContent?: React.ReactNode;
  emptySrc?: string;
}

// if there is an error loading the image, it will try to display fallback.
// fallbackContent has higher priority than fallbackSrc
// shows nothing if both are not provided.
// if src is empty, it will try to display emptyContent/emptySrc.
export function ImageWithFallback({
  src,
  fallbackContent,
  fallbackSrc,
  emptyContent,
  emptySrc,
  ...props
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);
  const [fallbackHasError, setFallbackHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
    setFallbackHasError(false);
  }, [src, fallbackSrc, fallbackContent]);

  if (!src) {
    if (emptyContent) {
      return <>{emptyContent}</>;
    } else if (emptySrc) {
      return <Image {...props} src={emptySrc} />;
    } else return null;
  }

  if (hasError) {
    if (fallbackContent) {
      return <>{fallbackContent}</>;
    } else if (fallbackSrc && !fallbackHasError) {
      return (
        <Image
          {...props}
          src={fallbackSrc}
          onError={() => !fallbackHasError && setFallbackHasError(true)}
        />
      );
    } else return null;
  }

  return (
    <Image
      src={src}
      {...props}
      onError={() => !hasError && setHasError(true)}
    />
  );
}
