import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';

interface ImageWithSkeletonProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt?: string;
  className?: string;
  loading?: "lazy" | "eager";
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
  containerClassName?: string;
  skeletonClassName?: string;
  width?: number;
}

export function ImageWithSkeleton({ 
  src, 
  alt, 
  className, 
  containerClassName,
  skeletonClassName,
  width,
  loading = "lazy",
  ...props 
}: ImageWithSkeletonProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Optimize weserv.nl image URLs
  const optimizedSrc = useMemo(() => {
    if (!src || hasError) return src;
    if (src.includes('images.weserv.nl')) {
      let newSrc = src;
      // Replace existing width parameter if width prop is provided
      if (width) {
        newSrc = newSrc.replace(/&w=\d+/, `&w=${width}`);
        if (!newSrc.includes(`&w=${width}`)) {
          newSrc += `&w=${width}`;
        }
      }
      // Add format and quality parameters if not present
      if (!newSrc.includes('&output=')) {
        newSrc += '&output=webp';
      }
      if (!newSrc.includes('&q=')) {
        newSrc += '&q=75';
      }
      return newSrc;
    }
    return src;
  }, [src, width, hasError]);

  return (
    <div className={`relative overflow-hidden ${containerClassName || ''}`}>
      {isLoading && !hasError && (
        <div className={`absolute inset-0 animate-pulse z-10 ${skeletonClassName || 'bg-slate-200'}`} />
      )}
      {hasError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 text-slate-400">
          <div className="text-center p-4">
            <div className="text-xs">图片加载失败</div>
          </div>
        </div>
      ) : (
        <motion.img
          src={optimizedSrc}
          alt={alt}
          className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoading ? 0 : 1 }}
          transition={{ duration: 0.5 }}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          loading={loading}
          decoding="async"
          {...props}
        />
      )}
    </div>
  );
}
