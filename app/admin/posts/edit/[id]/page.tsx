'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { isAdmin } from '@/lib/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { uploadImage } from '@/lib/storage';
import { BlogPost } from '@/types';
import Link from 'next/link';

export default function EditPost() {
  const [user, loading] = useAuthState(auth);
  const [admin, setAdmin] = useState(false);
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    image: '',
    redirectUrl: '',
    tags: '',
  });

  const [loadingPost, setLoadingPost] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      isAdmin(user).then((isAdminUser) => {
        if (!isAdminUser) {
          router.push('/admin/login');
        } else {
          setAdmin(true);
        }
      });
    } else if (!loading && !user) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  const loadPost = useCallback(async () => {
    if (!postId) {
      setLoadingPost(false);
      return;
    }

    try {
      const postDoc = await getDoc(doc(db, 'blogPosts', postId));
      if (!postDoc.exists()) {
        router.push('/admin');
        return;
      }

      const post = { id: postDoc.id, ...postDoc.data() } as BlogPost;
      setFormData({
        title: post.title || '',
        slug: post.slug || '',
        description: post.description || '',
        content: post.content || '',
        image: post.image || '',
        redirectUrl: post.redirectUrl || '',
        tags: post.tags ? post.tags.join(', ') : '',
      });
      
      if (post.image) {
        setImagePreview(null);
      }
    } catch (error) {
      console.error('Error loading post:', error);
      setError('Yazı yüklenirken bir hata oluştu');
      router.push('/admin');
    } finally {
      setLoadingPost(false);
    }
  }, [postId, router]);

  useEffect(() => {
    if (admin && postId) {
      loadPost();
    }
  }, [admin, postId, loadPost]);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const slug = generateSlug(e.target.value);
    setFormData({ ...formData, slug });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const tagsArray = formData.tags
        .split(',')
        .map((tag) => tag.trim().toLowerCase())
        .filter((tag) => tag.length > 0);

      const finalSlug = formData.slug.trim().toLowerCase() || generateSlug(formData.title.trim());
      
      if (!finalSlug) {
        setError('Slug oluşturulamadı. Lütfen başlık veya slug girin.');
        setSubmitting(false);
        return;
      }

      const postData = {
        title: formData.title.trim(),
        slug: finalSlug,
        description: formData.description.trim(),
        content: formData.content.trim(),
        image: formData.image.trim() || '/placeholder.jpg',
        redirectUrl: formData.redirectUrl.trim(),
        tags: tagsArray,
      };

      await updateDoc(doc(db, 'blogPosts', postId), postData);
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Yazı güncellenirken bir hata oluştu');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || loadingPost || !admin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link href="/admin" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
            ← Admin Paneline Dön
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Yazıyı Düzenle</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Başlık *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div className="hidden">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug (URL) *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={handleSlugChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="ornek-yazi-basligi"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Açıklama *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                İçerik *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                rows={10}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Görsel
              </label>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-2">
                    Bilgisayardan Yükle
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      if (file.size > 5 * 1024 * 1024) {
                        setError('Görsel boyutu 5MB\'dan küçük olmalıdır');
                        return;
                      }

                      setUploadingImage(true);
                      setError('');

                      try {
                        const imageUrl = await uploadImage(file);
                        setFormData({ ...formData, image: imageUrl });
                        const preview = URL.createObjectURL(file);
                        setImagePreview(preview);
                      } catch (err: any) {
                        setError(err.message || 'Görsel yüklenirken hata oluştu');
                      } finally {
                        setUploadingImage(false);
                      }
                    }}
                    disabled={uploadingImage}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  {uploadingImage && (
                    <p className="text-sm text-blue-600 mt-2">Görsel yükleniyor...</p>
                  )}
                </div>


                {imagePreview && (
                  <div className="mt-4">
                    <p className="text-xs text-gray-600 mb-2">Önizleme:</p>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-w-full h-48 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                )}

                {formData.image && !imagePreview && (
                  <div className="mt-4">
                    <p className="text-xs text-gray-600 mb-2">Mevcut Görsel:</p>
                    <img
                      src={formData.image}
                      alt="Current"
                      className="max-w-full h-48 object-cover rounded-lg border border-gray-200"
                      onError={() => setImagePreview(null)}
                    />
                    <div className="text-sm text-gray-700 bg-gray-50 p-2 rounded border border-gray-200 break-all mt-2">
                      {formData.image}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yönlendirme URL
              </label>
              <input
                type="url"
                value={formData.redirectUrl}
                onChange={(e) => setFormData({ ...formData, redirectUrl: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategoriler (virgülle ayırın)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="teknoloji, robotik, cihaz"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Güncelleniyor...' : 'Değişiklikleri Kaydet'}
              </button>
              <Link
                href="/admin"
                className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors inline-block"
              >
                İptal
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

