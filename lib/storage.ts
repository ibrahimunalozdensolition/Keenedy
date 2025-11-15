import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

export async function uploadImage(file: File): Promise<string> {
  try {
    const timestamp = Date.now();
    const fileName = `blog-images/${timestamp}-${file.name}`;
    const storageRef = ref(storage, fileName);
    
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  } catch (error: any) {
    throw new Error(`Görsel yüklenirken hata oluştu: ${error.message}`);
  }
}

