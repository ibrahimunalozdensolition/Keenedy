'use client';

import { useState } from 'react';
import { TagCount } from '@/types';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface TagsSidebarProps {
  tags: TagCount[];
}

export default function TagsSidebar({ tags }: TagsSidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const searchParams = useSearchParams();
  const selectedTag = searchParams?.get('tag')?.toLowerCase() || '';

  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors border-b border-gray-200"
      >
        <h2 className="text-xl font-bold text-gray-900">Kategoriler</h2>
        <svg
          className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="px-6 py-6">
          <div className="flex flex-col gap-2">
            {tags.map((tagCount) => {
              const isSelected = selectedTag === tagCount.tag.toLowerCase();
              return (
                <Link
                  key={tagCount.tag}
                  href={`/blog?tag=${encodeURIComponent(tagCount.tag)}`}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <span>{tagCount.tag}</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                    isSelected
                      ? 'bg-blue-700 text-white'
                      : 'bg-white text-gray-600'
                  }`}>
                    {tagCount.count}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
