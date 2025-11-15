import { auth } from './firebase';
import { signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

export async function loginAdmin(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    const adminDoc = await getDoc(doc(db, 'admins', user.uid));
    if (!adminDoc.exists() || !adminDoc.data().isAdmin) {
      await signOut(auth);
      throw new Error('Bu kullanıcı admin yetkisine sahip değil');
    }
    
    return user;
  } catch (error: any) {
    throw new Error(error.message || 'Giriş başarısız');
  }
}

export async function logoutAdmin() {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message || 'Çıkış başarısız');
  }
}

export async function isAdmin(user: User | null): Promise<boolean> {
  if (!user) return false;
  
  try {
    const adminDoc = await getDoc(doc(db, 'admins', user.uid));
    return adminDoc.exists() && adminDoc.data().isAdmin === true;
  } catch (error) {
    return false;
  }
}

export function getCurrentUser(): User | null {
  return auth.currentUser;
}

