import Image from 'next/image';
import Link from 'next/link';
import { Ad } from '@/types';

interface AdBannerProps {
  ad: Ad;
  className?: string;
}

export default function AdBanner({ ad, className = '' }: AdBannerProps) {
  if (!ad.isActive) return null;

  return (
    <Link 
      href={`/redirect?url=${encodeURIComponent(ad.redirectUrl)}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`block ${className}`}
    >
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative w-full h-32">
          <Image
            src={ad.image || '/placeholder.jpg'}
            alt={ad.title}
            fill
            className="object-cover"
          />
        </div>
        {ad.title && (
          <div className="p-3">
            <p className="text-sm font-medium text-gray-700 text-center">
              {ad.title}
            </p>
          </div>
        )}
      </div>
    </Link>
  );
}

