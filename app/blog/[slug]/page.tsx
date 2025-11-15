import { getBlogPostBySlug, getAllActiveAds, getAllTags } from '@/lib/firestore';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AdBanner from '@/components/AdBanner';
import AdSense from '@/components/AdSense';
import TagsSidebar from '@/components/TagsSidebar';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  
  if (!slug || typeof slug !== 'string' || slug.trim() === '') {
    notFound();
  }

  const post = await getBlogPostBySlug(slug.trim());
  const allAds = await getAllActiveAds();
  const tags = await getAllTags();
  
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
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-8">
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="sticky top-28">
              <Suspense fallback={<div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">Yükleniyor...</div>}>
                <TagsSidebar tags={tags} />
              </Suspense>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <article className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden bg-gray-200">
                {post.image ? (
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              </div>
              
              <div className="p-6 sm:p-8 md:p-10 lg:p-12">
                <div className="mb-4">
                  <span className="inline-block text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                    {formatDate(post.createdAt)}
                  </span>
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  {post.title}
                </h1>

                {contentTopAds.length > 0 && (
                  <div className="mb-8">
                    {contentTopAds.slice(0, 1).map((ad) => (
                      <AdBanner key={ad.id} ad={ad} />
                    ))}
                  </div>
                )}

                <div className="prose prose-lg max-w-none">
                  <p className="text-xl text-gray-700 mb-8 leading-relaxed font-medium">
                    {post.description}
                  </p>
                  
                  <div 
                    className="text-gray-700 leading-relaxed whitespace-pre-line text-base sm:text-lg"
                    dangerouslySetInnerHTML={{ __html: post.content || post.description }}
                  />
                </div>

                {post.redirectUrl && (
                  <div className="mt-10 pt-8 border-t border-gray-200">
                    <Link
                      href={`/redirect?url=${encodeURIComponent(post.redirectUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                      Devamını Oku
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                )}

                {contentBottomAds.length > 0 && (
                  <div className="mt-10 pt-8 border-t border-gray-200">
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
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200 group"
              >
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Tüm Blog Yazılarına Dön
              </Link>
            </div>
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
      </div>
    </div>
  );
}

