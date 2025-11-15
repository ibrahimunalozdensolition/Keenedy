import { collection, getDocs, query, where, orderBy, limit, doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { BlogPost, Ad } from '@/types';

export async function getBlogPosts(maxPosts?: number): Promise<BlogPost[]> {
  try {
    const blogPostsRef = collection(db, 'blogPosts');
    let q = query(blogPostsRef, orderBy('createdAt', 'desc'));
    
    if (maxPosts) {
      q = query(blogPostsRef, orderBy('createdAt', 'desc'), limit(maxPosts));
    }
    
    const querySnapshot = await getDocs(q);
    const posts: BlogPost[] = [];
    
    querySnapshot.forEach((doc) => {
      posts.push({
        id: doc.id,
        ...doc.data(),
      } as BlogPost);
    });
    
    return posts;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const blogPostsRef = collection(db, 'blogPosts');
    const q = query(blogPostsRef, where('slug', '==', slug));
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
    console.error('Error fetching blog post:', error);
    return null;
  }
}

export async function getAdsByPosition(position: Ad['position']): Promise<Ad[]> {
  try {
    const adsRef = collection(db, 'ads');
    const q = query(
      adsRef,
      where('position', '==', position),
      where('isActive', '==', true)
    );
    const querySnapshot = await getDocs(q);
    const ads: Ad[] = [];
    
    querySnapshot.forEach((doc) => {
      ads.push({
        id: doc.id,
        ...doc.data(),
      } as Ad);
    });
    
    return ads;
  } catch (error) {
    console.error('Error fetching ads:', error);
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
      ads.push({
        id: doc.id,
        ...doc.data(),
      } as Ad);
    });
    
    return ads;
  } catch (error) {
    console.error('Error fetching ads:', error);
    return [];
  }
}

