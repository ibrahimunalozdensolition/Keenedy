import { getBlogPostBySlug, getAllActiveAds } from '@/lib/firestore';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AdBanner from '@/components/AdBanner';
import AdSense from '@/components/AdSense';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPostBySlug(params.slug);
  const allAds = await getAllActiveAds();
  
  const sidebarAds = allAds.filter(ad => ad.position === 'sidebar');
  const contentTopAds = allAds.filter(ad => ad.position === 'content-top');
  const contentBottomAds = allAds.filter(ad => ad.position === 'content-bottom');

  if (!post) {
    notFound();
  }

  const formatDate = (date: Date | { seconds: number; nanoseconds: number }) => {
    if (date instanceof Date) {
      return date.toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
    return new Date(date.seconds * 1000).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <article className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative w-full h-48 sm:h-64 md:h-96">
                <Image
                  src={post.image || '/placeholder.jpg'}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="p-4 sm:p-6 md:p-8">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                  {post.title}
                </h1>
                
                <div className="text-gray-500 mb-6">
                  {formatDate(post.createdAt)}
                </div>

                {contentTopAds.length > 0 && (
                  <div className="mb-6">
                    {contentTopAds.slice(0, 1).map((ad) => (
                      <AdBanner key={ad.id} ad={ad} />
                    ))}
                  </div>
                )}

                <div className="prose max-w-none">
                  <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                    {post.description}
                  </p>
                  
                  <div 
                    className="text-gray-700 leading-relaxed whitespace-pre-line"
                    dangerouslySetInnerHTML={{ __html: post.content || post.description }}
                  />
                </div>

                {post.redirectUrl && (
                  <div className="mt-8">
                    <Link
                      href={`/redirect?url=${encodeURIComponent(post.redirectUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Devamını Oku →
                    </Link>
                  </div>
                )}

                {contentBottomAds.length > 0 && (
                  <div className="mt-8">
                    {contentBottomAds.slice(0, 1).map((ad) => (
                      <AdBanner key={ad.id} ad={ad} />
                    ))}
                  </div>
                )}
              </div>
            </article>

            <div className="mt-8">
              <Link
                href="/blog"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Tüm Blog Yazılarına Dön
              </Link>
            </div>
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
      </div>
    </div>
  );
}

