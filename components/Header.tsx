import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-xl sm:text-2xl font-bold text-gray-800 hover:text-gray-600 transition-colors">
            Blog Sitesi
          </Link>
          <div className="flex gap-4 sm:gap-6">
            <Link href="/" className="text-sm sm:text-base text-gray-700 hover:text-gray-900 transition-colors">
              Ana Sayfa
            </Link>
            <Link href="/blog" className="text-sm sm:text-base text-gray-700 hover:text-gray-900 transition-colors">
              Blog
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

