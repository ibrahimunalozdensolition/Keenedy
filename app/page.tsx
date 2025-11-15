import { getBlogPosts, getAllActiveAds, getAllTags } from '@/lib/firestore';
import BlogCard from '@/components/BlogCard';
import AdBanner from '@/components/AdBanner';
import AdSense from '@/components/AdSense';
import TagsSidebar from '@/components/TagsSidebar';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const blogPosts = await getBlogPosts(6);
  const allAds = await getAllActiveAds();
  const tags = await getAllTags();
  
  const headerAds = allAds.filter(ad => ad.position === 'header');
  const sidebarAds = allAds.filter(ad => ad.position === 'sidebar');
  const footerAds = allAds.filter(ad => ad.position === 'footer');
  const contentTopAds = allAds.filter(ad => ad.position === 'content-top');
  const contentBottomAds = allAds.filter(ad => ad.position === 'content-bottom');

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {headerAds.length > 0 && (
          <div className="mb-8 sm:mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {headerAds.slice(0, 3).map((ad) => (
                <AdBanner key={ad.id} ad={ad} />
              ))}
            </div>
          </div>
        )}

        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID && (
          <div className="mb-8 sm:mb-12">
            <AdSense adSlot="1234567890" className="mb-4" />
          </div>
        )}

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
              <Suspense fallback={<div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">Yükleniyor...</div>}>
                <TagsSidebar tags={tags} />
              </Suspense>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="mb-8 sm:mb-12">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text">
                Son Blog Yazıları
              </h1>
              <p className="text-gray-600 text-lg">En güncel içerikler ve blog yazıları</p>
            </div>
            {blogPosts.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 sm:p-16 text-center border border-gray-100">
                <div className="inline-block p-4 bg-gray-100 rounded-full mb-6">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-600 text-lg">Henüz blog yazısı eklenmemiş.</p>
                <p className="text-gray-500 text-sm mt-2">Yakında harika içerikler paylaşacağız!</p>
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
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">Reklamlar</h2>
                  <div className="space-y-4">
                    {sidebarAds.map((ad) => (
                      <AdBanner key={ad.id} ad={ad} />
                    ))}
                  </div>
                </div>
              )}

              {process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID && (
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <AdSense adSlot="1234567890" />
                </div>
              )}
            </div>
          </aside>
        </div>

        {contentBottomAds.length > 0 && (
          <div className="mt-12 sm:mt-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {contentBottomAds.slice(0, 3).map((ad) => (
                <AdBanner key={ad.id} ad={ad} />
              ))}
            </div>
          </div>
        )}

        {footerAds.length > 0 && (
          <div className="mt-12 sm:mt-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {footerAds.slice(0, 3).map((ad) => (
                <AdBanner key={ad.id} ad={ad} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
