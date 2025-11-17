import { getBlogPosts, getAllActiveAds, getAllTags, searchBlogPosts } from '@/lib/firestore';
import BlogCard from '@/components/BlogCard';
import AdBanner from '@/components/AdBanner';
import AdSense from '@/components/AdSense';
import TagsSidebar from '@/components/TagsSidebar';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface BlogPageProps {
  searchParams: Promise<{
    tag?: string;
    q?: string;
  }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const selectedTag = params?.tag || '';
  const searchQuery = params?.q || '';
  
  const blogPosts = searchQuery 
    ? await searchBlogPosts(searchQuery)
    : await getBlogPosts(undefined, selectedTag);
  const allAds = await getAllActiveAds();
  const tags = await getAllTags();
  
  const sidebarAds = allAds.filter(ad => ad.position === 'sidebar');
  const contentTopAds = allAds.filter(ad => ad.position === 'content-top');

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-100 mb-3 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
            {searchQuery 
              ? `"${searchQuery}" için arama sonuçları` 
              : selectedTag 
                ? `${selectedTag} Etiketli Blog Yazıları` 
                : 'Tüm Blog Yazıları'}
          </h1>
          <p className="text-gray-400 text-lg">
            {searchQuery 
              ? `${blogPosts.length} sonuç bulundu` 
              : selectedTag 
                ? `${selectedTag} etiketine sahip içerikler` 
                : 'Tüm içeriklerimizi keşfedin'}
          </p>
          {(selectedTag || searchQuery) && (
            <div className="mt-4">
              <a
                href="/blog"
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Filtreyi Temizle
              </a>
            </div>
          )}
        </div>

        {contentTopAds.length > 0 && (
          <div className="mb-8 sm:mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {contentTopAds.slice(0, 2).map((ad) => (
                <AdBanner key={ad.id} ad={ad} />
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-8">
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="sticky top-28">
              <Suspense fallback={<div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 text-gray-300">Yükleniyor...</div>}>
                <TagsSidebar tags={tags} />
              </Suspense>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {blogPosts.length === 0 ? (
              <div className="bg-gray-800 rounded-2xl shadow-lg p-12 sm:p-16 text-center border border-gray-700">
                <div className="inline-block p-4 bg-gray-700 rounded-full mb-6">
                  {searchQuery ? (
                    <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  ) : (
                    <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  )}
                </div>
                <p className="text-gray-300 text-lg">
                  {searchQuery ? `"${searchQuery}" için sonuç bulunamadı.` : 'Henüz blog yazısı eklenmemiş.'}
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  {searchQuery ? 'Farklı bir arama terimi deneyin.' : 'Yakında harika içerikler paylaşacağız!'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                {blogPosts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>

          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="sticky top-28 space-y-6">
              {sidebarAds.length > 0 && (
                <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
                  <h2 className="text-xl font-bold text-gray-100 mb-6 pb-3 border-b border-gray-700">Reklamlar</h2>
                  <div className="space-y-4">
                    {sidebarAds.map((ad) => (
                      <AdBanner key={ad.id} ad={ad} />
                    ))}
                  </div>
                </div>
              )}

              {process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID && (
                <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
                  <AdSense adSlot="1234567890" />
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

