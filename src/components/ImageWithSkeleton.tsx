import { useState } from 'react';
import { motion } from 'motion/react';

interface ImageWithSkeletonProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  containerClassName?: string;
  skeletonClassName?: string;
}

export function ImageWithSkeleton({ 
  src, 
  alt, 
  className, 
  containerClassName,
  skeletonClassName,
  ...props 
}: ImageWithSkeletonProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`relative overflow-hidden ${containerClassName || ''}`}>
      {isLoading && (
        <div className={`absolute inset-0 animate-pulse z-10 ${skeletonClassName || 'bg-slate-200'}`} />
      )}
      <motion.img
        src={src}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.5 }}
        onLoad={() => setIsLoading(false)}
        {...props}
      />
    </div>
  );
}
