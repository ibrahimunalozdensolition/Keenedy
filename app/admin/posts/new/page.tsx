'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { isAdmin } from '@/lib/auth';
import { collection, addDoc, Timestamp, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { uploadImage } from '@/lib/storage';
import Link from 'next/link';

export default function NewPost() {
  const [user, loading] = useAuthState(auth);
  const [admin, setAdmin] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    image: '',
    redirectUrl: '',
    tags: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

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

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const blogPostsRef = collection(db, 'blogPosts');
        const querySnapshot = await getDocs(blogPostsRef);
        const tagSet = new Set<string>();
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const tags = data.tags as string[] | undefined;
          if (tags && Array.isArray(tags)) {
            tags.forEach((tag) => {
              const normalizedTag = tag.trim().toLowerCase();
              if (normalizedTag) {
                tagSet.add(normalizedTag);
              }
            });
          }
        });
        
        setAvailableTags(Array.from(tagSet).sort());
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    if (admin) {
      fetchTags();
    }
  }, [admin]);

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

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    // Her zaman başlıktan otomatik slug oluştur
    const autoSlug = generateSlug(title);
    setFormData({ ...formData, title, slug: autoSlug });
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const slug = generateSlug(e.target.value);
    setFormData({ ...formData, slug });
  };

  const handleTagClick = (tag: string) => {
    const normalizedTag = tag.trim().toLowerCase();
    if (normalizedTag && !selectedTags.includes(normalizedTag)) {
      setSelectedTags([...selectedTags, normalizedTag]);
      setFormData({ ...formData, tags: '' });
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleTagInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, tags: value });
    
    if (value.endsWith(',')) {
      const tag = value.slice(0, -1).trim().toLowerCase();
      if (tag && !selectedTags.includes(tag)) {
        setSelectedTags([...selectedTags, tag]);
        setFormData({ ...formData, tags: '' });
      } else {
        setFormData({ ...formData, tags: '' });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const inputTags = formData.tags
        .split(',')
        .map((tag) => tag.trim().toLowerCase())
        .filter((tag) => tag.length > 0);
      
      const tagsArray = [...new Set([...selectedTags, ...inputTags])];

      const finalSlug = formData.slug.trim().toLowerCase() || generateSlug(formData.title.trim());
      
      if (!finalSlug) {
        setError('Slug oluşturulamadı. Lütfen başlık veya slug girin.');
        setSubmitting(false);
        return;
      }

      const allImages = images.length > 0 ? images : (formData.image.trim() ? [formData.image.trim()] : []);
      
      const postData = {
        title: formData.title.trim(),
        slug: finalSlug,
        description: formData.description.trim(),
        content: formData.content.trim(),
        image: allImages[0] || '/placeholder.jpg',
        images: allImages,
        redirectUrl: formData.redirectUrl.trim(),
        tags: tagsArray,
        createdAt: Timestamp.now(),
      };

      await addDoc(collection(db, 'blogPosts'), postData);
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Yazı eklenirken bir hata oluştu');
    } finally {
      setSubmitting(false);
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
        <div className="mb-8">
          <Link href="/admin" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">
            ← Admin Paneline Dön
          </Link>
          <h1 className="text-3xl font-bold text-gray-100">Yeni Yazı Ekle</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-700">
          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-sm mb-6">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Başlık *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={handleTitleChange}
                required
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none placeholder-gray-500"
              />
            </div>

            <div className="hidden">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Slug (URL) *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={handleSlugChange}
                required
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none placeholder-gray-500"
                placeholder="ornek-yazi-basligi"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Açıklama *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={3}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none placeholder-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                İçerik *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                rows={10}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono text-sm placeholder-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Fotoğraflar
              </label>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-2">
                    Birden Fazla Fotoğraf Yükle
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={async (e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length === 0) return;

                      const oversizedFiles = files.filter(f => f.size > 5 * 1024 * 1024);
                      if (oversizedFiles.length > 0) {
                        setError('Tüm görseller 5MB\'dan küçük olmalıdır');
                        return;
                      }

                      setUploadingImages(true);
                      setError('');

                      try {
                        const uploadPromises = files.map(file => uploadImage(file));
                        const uploadedUrls = await Promise.all(uploadPromises);
                        setImages(prev => [...prev, ...uploadedUrls]);
                        
                        const previews = files.map(file => URL.createObjectURL(file));
                        setImagePreviews(prev => [...prev, ...previews]);
                      } catch (err: any) {
                        setError(err.message || 'Görseller yüklenirken hata oluştu');
                      } finally {
                        setUploadingImages(false);
                      }
                    }}
                    disabled={uploadingImages}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  {uploadingImages && (
                    <p className="text-sm text-blue-400 mt-2">Fotoğraflar yükleniyor...</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-2">
                    Tek Fotoğraf URL (Eski Yöntem)
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none placeholder-gray-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                {(images.length > 0 || imagePreviews.length > 0) && (
                  <div className="mt-4">
                    <p className="text-xs text-gray-400 mb-2">Yüklenen Fotoğraflar ({images.length}):</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {images.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={imagePreviews[index] || url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-gray-600"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImages(prev => prev.filter((_, i) => i !== index));
                              setImagePreviews(prev => prev.filter((_, i) => i !== index));
                            }}
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {formData.image && images.length === 0 && !imagePreview && (
                  <div className="mt-4">
                    <p className="text-xs text-gray-400 mb-2">Görsel URL:</p>
                    <div className="text-sm text-gray-300 bg-gray-700 p-2 rounded border border-gray-600 break-all">
                      {formData.image}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Yönlendirme URL
              </label>
              <input
                type="url"
                value={formData.redirectUrl}
                onChange={(e) => setFormData({ ...formData, redirectUrl: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none placeholder-gray-500"
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Kategoriler
              </label>
              
              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-red-300 transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <input
                type="text"
                value={formData.tags}
                onChange={handleTagInput}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none placeholder-gray-500"
                placeholder="Yeni etiket ekle (virgülle ayırın)"
              />

              {availableTags.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-gray-400 mb-2">Mevcut Etiketler:</p>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleTagClick(tag)}
                        disabled={selectedTags.includes(tag)}
                        className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                          selectedTags.includes(tag)
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-700 text-gray-300 hover:bg-blue-600 hover:text-white'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Kaydediliyor...' : 'Yazıyı Kaydet'}
              </button>
              <Link
                href="/admin"
                className="bg-gray-700 text-gray-200 px-8 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors inline-block"
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

