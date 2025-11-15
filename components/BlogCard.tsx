import Image from 'next/image';
import Link from 'next/link';
import { BlogPost } from '@/types';

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="block">
      <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
        <div className="relative w-full h-48">
          <Image
            src={post.image || '/placeholder.jpg'}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
            {post.title}
          </h2>
          <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
            {post.description}
          </p>
          <span className="text-blue-600 font-medium hover:text-blue-800 transition-colors">
            Devamını Oku →
          </span>
        </div>
      </article>
    </Link>
  );
}

