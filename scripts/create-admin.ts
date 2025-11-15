import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBEAC51bheW_WN78V20RvFFfj61Dvy8DaU",
  authDomain: "kennedy-4135f.firebaseapp.com",
  projectId: "kennedy-4135f",
  storageBucket: "kennedy-4135f.firebasestorage.app",
  messagingSenderId: "722910692732",
  appId: "1:722910692732:web:60e4551c7f1013781310f9",
  measurementId: "G-6LX1RH5JX2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function createAdmin() {
  const email = process.argv[2];
  const password = process.argv[3];

  if (!email || !password) {
    console.error('Kullanım: npm run create-admin <email> <password>');
    console.error('Örnek: npm run create-admin admin@example.com mypassword123');
    process.exit(1);
  }

  try {
    console.log('Admin kullanıcısı oluşturuluyor...');
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log('✅ Kullanıcı oluşturuldu:', user.uid);
    
    await setDoc(doc(db, 'admins', user.uid), {
      email: email,
      isAdmin: true,
      createdAt: new Date(),
    });
    
    console.log('✅ Admin yetkisi verildi!');
    console.log('\n📧 Email:', email);
    console.log('🆔 User ID:', user.uid);
    console.log('\nArtık /admin/login sayfasından giriş yapabilirsiniz.');
    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ Hata oluştu:');
    console.error('Mesaj:', error.message);
    console.error('Kod:', error.code);
    
    if (error.code === 'auth/email-already-in-use') {
      console.error('\n⚠️  Bu email zaten kullanılıyor.');
      console.error('Çözüm: Firebase Console > Authentication > Users bölümünden kullanıcıyı bulun ve admin yetkisi verin.');
    }
    
    process.exit(1);
  }
}

createAdmin();

