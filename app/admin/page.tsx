'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { isAdmin, logoutAdmin } from '@/lib/auth';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { BlogPost } from '@/types';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminDashboard() {
  const [user, loading] = useAuthState(auth);
  const [admin, setAdmin] = useState(false);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      isAdmin(user).then((isAdminUser) => {
        if (!isAdminUser) {
          router.push('/admin/login');
        } else {
          setAdmin(true);
          loadPosts();
        }
      });
    } else if (!loading && !user) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  const loadPosts = async () => {
    try {
      const postsRef = collection(db, 'blogPosts');
      const snapshot = await getDocs(postsRef);
      const postsData: BlogPost[] = [];
      snapshot.forEach((doc) => {
        postsData.push({
          id: doc.id,
          ...doc.data(),
        } as BlogPost);
      });
      postsData.sort((a, b) => {
        const dateA = a.createdAt instanceof Date 
          ? a.createdAt.getTime() 
          : (a.createdAt as { seconds: number }).seconds * 1000;
        const dateB = b.createdAt instanceof Date 
          ? b.createdAt.getTime() 
          : (b.createdAt as { seconds: number }).seconds * 1000;
        return dateB - dateA;
      });
      setPosts(postsData);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Bu yazıyı silmek istediğinize emin misiniz?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'blogPosts', postId));
      setPosts(posts.filter((p) => p.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Yazı silinirken bir hata oluştu');
    }
  };

  const handleLogout = async () => {
    try {
      await logoutAdmin();
      router.push('/admin/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading || !admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-gray-300">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-100">Admin Paneli</h1>
            <p className="text-gray-400 mt-1">Blog yazılarını yönetin</p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/admin/posts/new"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-500 transition-colors"
            >
              Yeni Yazı Ekle
            </Link>
            <button
              onClick={handleLogout}
              className="bg-gray-700 text-gray-200 px-6 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
            >
              Çıkış Yap
            </button>
          </div>
        </div>

        {loadingPosts ? (
          <div className="text-center py-12">
            <div className="text-gray-400">Yazılar yükleniyor...</div>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-gray-800 rounded-xl shadow-lg p-12 text-center border border-gray-700">
            <p className="text-gray-300 text-lg">Henüz yazı eklenmemiş.</p>
            <Link
              href="/admin/posts/new"
              className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-500 transition-colors"
            >
              İlk Yazıyı Ekle
            </Link>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700 border-b border-gray-600">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-100">Fotoğraf</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-100">Başlık</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-100">Slug</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-100">Tarih</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-100">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-700">
                      <td className="px-6 py-4">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-700">
                          {post.image ? (
                            <Image
                              src={post.image}
                              alt={post.title}
                              fill
                              className="object-cover"
                              sizes="64px"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-700">
                              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-100">{post.title}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-400">{post.slug || '-'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-400">
                          {post.createdAt instanceof Date
                            ? post.createdAt.toLocaleDateString('tr-TR')
                            : new Date((post.createdAt as { seconds: number }).seconds * 1000).toLocaleDateString('tr-TR')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Link
                            href={`/admin/posts/edit/${post.id}`}
                            className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                          >
                            Düzenle
                          </Link>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="text-red-400 hover:text-red-300 text-sm font-medium"
                          >
                            Sil
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

