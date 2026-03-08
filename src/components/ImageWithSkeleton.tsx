import { useState, useMemo } from 'react';
import { motion } from 'motion/react';

interface ImageWithSkeletonProps extends React.ImgHTMLAttributes<HTMLImageElement> {
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
  ...props 
}: ImageWithSkeletonProps) {
  const [isLoading, setIsLoading] = useState(true);

  // Optimize weserv.nl image URLs
  const optimizedSrc = useMemo(() => {
    if (!src) return src;
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
  }, [src, width]);

  return (
    <div className={`relative overflow-hidden ${containerClassName || ''}`}>
      {isLoading && (
        <div className={`absolute inset-0 animate-pulse z-10 ${skeletonClassName || 'bg-slate-200'}`} />
      )}
      <motion.img
        src={optimizedSrc}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.5 }}
        onLoad={() => setIsLoading(false)}
        loading="lazy"
        decoding="async"
        {...props}
      />
    </div>
  );
}
