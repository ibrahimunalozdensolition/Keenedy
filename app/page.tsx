import { getBlogPosts, getAllActiveAds } from '@/lib/firestore';
import BlogCard from '@/components/BlogCard';
import AdBanner from '@/components/AdBanner';
import AdSense from '@/components/AdSense';

export default async function Home() {
  const blogPosts = await getBlogPosts(6);
  const allAds = await getAllActiveAds();
  
  const headerAds = allAds.filter(ad => ad.position === 'header');
  const sidebarAds = allAds.filter(ad => ad.position === 'sidebar');
  const footerAds = allAds.filter(ad => ad.position === 'footer');
  const contentTopAds = allAds.filter(ad => ad.position === 'content-top');
  const contentBottomAds = allAds.filter(ad => ad.position === 'content-bottom');

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {headerAds.length > 0 && (
          <div className="mb-6 sm:mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {headerAds.slice(0, 3).map((ad) => (
                <AdBanner key={ad.id} ad={ad} />
              ))}
            </div>
          </div>
        )}

        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID && (
          <div className="mb-8">
            <AdSense adSlot="1234567890" className="mb-4" />
          </div>
        )}

        {contentTopAds.length > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contentTopAds.slice(0, 2).map((ad) => (
                <AdBanner key={ad.id} ad={ad} />
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">Son Blog Yazıları</h1>
            {blogPosts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-600">Henüz blog yazısı eklenmemiş.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {blogPosts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {sidebarAds.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Reklamlar</h2>
                  <div className="space-y-4">
                    {sidebarAds.map((ad) => (
                      <AdBanner key={ad.id} ad={ad} />
                    ))}
                  </div>
                </div>
              )}

              {process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID && (
                <div>
                  <AdSense adSlot="1234567890" />
                </div>
              )}
            </div>
          </div>
        </div>

        {contentBottomAds.length > 0 && (
          <div className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {contentBottomAds.slice(0, 3).map((ad) => (
                <AdBanner key={ad.id} ad={ad} />
              ))}
            </div>
          </div>
        )}

        {footerAds.length > 0 && (
          <div className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
