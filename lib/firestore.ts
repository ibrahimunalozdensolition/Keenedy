import { collection, getDocs, query, where, orderBy, limit, doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { BlogPost, Ad, TagCount } from '@/types';

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

export async function getBlogPosts(maxPosts?: number, tag?: string): Promise<BlogPost[]> {
  try {
    const blogPostsRef = collection(db, 'blogPosts');
    let q;
    
    if (tag && tag.trim()) {
      const normalizedTag = tag.trim().toLowerCase();
      
      try {
        q = query(
          blogPostsRef,
          where('tags', 'array-contains', normalizedTag),
          orderBy('createdAt', 'desc')
        );
        if (maxPosts) {
          q = query(
            blogPostsRef,
            where('tags', 'array-contains', normalizedTag),
            orderBy('createdAt', 'desc'),
            limit(maxPosts)
          );
        }
      } catch (error) {
        q = query(blogPostsRef);
      }
    } else {
      try {
        q = query(blogPostsRef, orderBy('createdAt', 'desc'));
        if (maxPosts) {
          q = query(blogPostsRef, orderBy('createdAt', 'desc'), limit(maxPosts));
        }
      } catch (error) {
        q = query(blogPostsRef);
        if (maxPosts) {
          q = query(blogPostsRef, limit(maxPosts));
        }
      }
    }
    
    const querySnapshot = await getDocs(q);
    const posts: BlogPost[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const post = {
        id: doc.id,
        ...data,
      } as BlogPost;
      
      if (!post.slug && post.title) {
        post.slug = generateSlug(post.title);
      }
      
      if (tag && tag.trim()) {
        const normalizedTag = tag.trim().toLowerCase();
        if (post.tags && Array.isArray(post.tags)) {
          const hasTag = post.tags.some(t => t.toLowerCase() === normalizedTag);
          if (hasTag) {
            posts.push(post);
          }
        }
      } else {
        posts.push(post);
      }
    });
    
    if (posts.length > 1) {
      posts.sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        const dateA = a.createdAt instanceof Date 
          ? a.createdAt.getTime() 
          : (a.createdAt as { seconds: number }).seconds * 1000;
        const dateB = b.createdAt instanceof Date 
          ? b.createdAt.getTime() 
          : (b.createdAt as { seconds: number }).seconds * 1000;
        return dateB - dateA;
      });
    }
    
    if (maxPosts) {
      return posts.slice(0, maxPosts);
    }
    
    return posts;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    if (!slug || typeof slug !== 'string' || slug.trim() === '') {
      return null;
    }
    
    const normalizedSlug = slug.trim().toLowerCase();
    const blogPostsRef = collection(db, 'blogPosts');
    const q = query(blogPostsRef, where('slug', '==', normalizedSlug));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      const allPosts = await getDocs(blogPostsRef);
      let foundPost = null;
      allPosts.forEach((doc) => {
        const data = doc.data();
        const postSlug = data.slug?.toLowerCase() || '';
        const postTitle = data.title || '';
        const generatedSlug = postTitle ? generateSlug(postTitle) : '';
        
        if (postSlug === normalizedSlug || 
            postSlug === slug.trim() || 
            generatedSlug === normalizedSlug) {
          foundPost = {
            id: doc.id,
            ...data,
            slug: postSlug || generatedSlug || doc.id,
          } as BlogPost;
        }
      });
      return foundPost;
    }
    
    const doc = querySnapshot.docs[0];
    const postData = doc.data();
    const post = {
      id: doc.id,
      ...postData,
      slug: postData.slug || (postData.title ? generateSlug(postData.title) : doc.id),
    } as BlogPost;
    return post;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

export async function getAdsByPosition(position: Ad['position']): Promise<Ad[]> {
  try {
    if (!position || typeof position !== 'string') {
      return [];
    }
    
    const adsRef = collection(db, 'ads');
    const q = query(
      adsRef,
      where('position', '==', position),
      where('isActive', '==', true)
    );
    const querySnapshot = await getDocs(q);
    const ads: Ad[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.isActive === true) {
        ads.push({
          id: doc.id,
          ...data,
        } as Ad);
      }
    });
    
    return ads;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching ads:', error);
    }
    return [];
  }
}

export async function getAllActiveAds(): Promise<Ad[]> {
  try {
    const adsRef = collection(db, 'ads');
    const q = query(adsRef, where('isActive', '==', true));
    const querySnapshot = await getDocs(q);
    const ads: Ad[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.isActive === true) {
        ads.push({
          id: doc.id,
          ...data,
        } as Ad);
      }
    });
    
    return ads;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching ads:', error);
    }
    return [];
  }
}

export async function getAllTags(): Promise<TagCount[]> {
  try {
    const blogPostsRef = collection(db, 'blogPosts');
    const querySnapshot = await getDocs(blogPostsRef);
    const tagMap = new Map<string, number>();
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const tags = data.tags as string[] | undefined;
      if (tags && Array.isArray(tags)) {
        tags.forEach((tag) => {
          const normalizedTag = tag.trim().toLowerCase();
          if (normalizedTag) {
            tagMap.set(normalizedTag, (tagMap.get(normalizedTag) || 0) + 1);
          }
        });
      }
    });
    
    const tagCounts: TagCount[] = Array.from(tagMap.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
    
    return tagCounts;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching tags:', error);
    }
    return [];
  }
}

