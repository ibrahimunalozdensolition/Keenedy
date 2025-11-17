'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

interface BlogPostImageProps {
  src: string;
  alt: string;
}

export default function BlogPostImage({ src, alt }: BlogPostImageProps) {
  const [isVertical, setIsVertical] = useState(false);

  useEffect(() => {
    const img = new window.Image();
    img.onload = () => {
      const aspectRatio = img.height / img.width;
      setIsVertical(aspectRatio > 1);
    };
    img.src = src;
  }, [src]);

  return (
    <div className={`relative w-full overflow-hidden ${isVertical ? 'bg-black aspect-video' : 'aspect-video bg-gray-200'}`}>
      <div className={`relative w-full h-full flex items-center justify-center ${isVertical ? 'bg-black' : ''}`}>
        {isVertical ? (
          <Image
            src={src}
            alt={alt}
            width={1200}
            height={675}
            className="object-contain"
            sizes="100vw"
            unoptimized
            style={{ maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto' }}
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            sizes="100vw"
            unoptimized
          />
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
    </div>
  );
}

