'use client';

import Image from 'next/image';
import Link from 'next/link';
import { BlogPost } from '@/types';
import { useState, useEffect } from 'react';

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  const [isVertical, setIsVertical] = useState(false);
  
  const displayImage = (post.images && post.images.length > 0) ? post.images[0] : post.image;

  useEffect(() => {
    if (displayImage) {
      const img = new window.Image();
      img.onload = () => {
        const aspectRatio = img.height / img.width;
        setIsVertical(aspectRatio > 1);
      };
      img.src = displayImage;
    }
  }, [displayImage]);

  const formatDate = (date: Date | { seconds: number; nanoseconds: number }) => {
    if (date instanceof Date) {
      return date.toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
    return new Date(date.seconds * 1000).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const slug = post.slug || (post.title ? generateSlug(post.title) : post.id);

  return (
    <Link href={`/blog/${slug}`} className="block group h-full">
      <article className="bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-700 hover:border-blue-500 hover:-translate-y-0.5 flex flex-col sm:flex-row h-full">
        <div className={`relative w-full sm:w-40 lg:w-48 flex-shrink-0 overflow-hidden ${isVertical ? 'bg-black aspect-video sm:aspect-auto sm:h-full' : 'aspect-video sm:aspect-auto sm:h-full bg-gray-700'}`}>
          {displayImage ? (
            <div className={`relative w-full h-full flex items-center justify-center ${isVertical ? 'bg-black' : ''}`}>
              {isVertical ? (
                <Image
                  src={displayImage}
                  alt={post.title}
                  width={800}
                  height={450}
                  className="object-contain group-hover:scale-110 transition-transform duration-500 sm:h-full sm:w-auto"
                  sizes="(max-width: 640px) 100vw, 320px"
                  unoptimized
                  style={{ maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto' }}
                />
              ) : (
                <Image
                  src={displayImage}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, 320px"
                  unoptimized
                />
              )}
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-700 min-h-[100px]">
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <div className="p-3 sm:p-3 flex flex-col flex-grow min-w-0 relative">
          <h2 className="text-lg sm:text-xl font-bold text-gray-100 mb-1 line-clamp-2 group-hover:text-blue-400 transition-colors duration-200 break-words">
            {post.title}
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mb-10 line-clamp-2 flex-grow leading-relaxed break-words">
            {post.description}
          </p>
          <span className="absolute bottom-4 right-4 inline-flex items-center text-blue-400 text-sm font-semibold hover:text-blue-300 transition-colors duration-200 group-hover:gap-1 gap-0.5 whitespace-nowrap">
            Devamı
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </article>
    </Link>
  );
}

