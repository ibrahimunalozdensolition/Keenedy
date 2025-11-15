import { collection, getDocs, query, where, orderBy, limit, doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { BlogPost, Ad } from '@/types';

export async function getBlogPosts(maxPosts?: number): Promise<BlogPost[]> {
  try {
    const blogPostsRef = collection(db, 'blogPosts');
    let q;
    
    try {
      q = query(blogPostsRef, orderBy('createdAt', 'desc'));
      if (maxPosts) {
        q = query(blogPostsRef, orderBy('createdAt', 'desc'), limit(maxPosts));
      }
    } catch (orderByError) {
      q = query(blogPostsRef);
      if (maxPosts) {
        q = query(blogPostsRef, limit(maxPosts));
      }
    }
    
    const querySnapshot = await getDocs(q);
    const posts: BlogPost[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      posts.push({
        id: doc.id,
        ...data,
      } as BlogPost);
    });
    
    if (posts.length > 1 && posts[0].createdAt && posts[1].createdAt) {
      posts.sort((a, b) => {
        const dateA = a.createdAt instanceof Date 
          ? a.createdAt.getTime() 
          : (a.createdAt as { seconds: number }).seconds * 1000;
        const dateB = b.createdAt instanceof Date 
          ? b.createdAt.getTime() 
          : (b.createdAt as { seconds: number }).seconds * 1000;
        return dateB - dateA;
      });
      
      if (maxPosts) {
        return posts.slice(0, maxPosts);
      }
    }
    
    return posts;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching blog posts:', error);
    }
    return [];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    if (!slug || typeof slug !== 'string' || slug.trim() === '') {
      return null;
    }
    
    const blogPostsRef = collection(db, 'blogPosts');
    const q = query(blogPostsRef, where('slug', '==', slug.trim()));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
    } as BlogPost;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching blog post:', error);
    }
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

