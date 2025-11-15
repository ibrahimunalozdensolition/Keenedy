import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

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

async function createAdminManual() {
  const userId = process.argv[2];
  const email = process.argv[3];

  if (!userId || !email) {
    console.error('Kullanım: npm run create-admin-manual <firebase-user-id> <email>');
    console.error('\nAdımlar:');
    console.error('1. Firebase Console > Authentication > Users bölümüne gidin');
    console.error('2. "Add user" butonuna tıklayın');
    console.error('3. Email ve şifre ile kullanıcı oluşturun');
    console.error('4. Oluşturulan kullanıcının UID\'sini kopyalayın');
    console.error('5. Bu scripti şu şekilde çalıştırın:');
    console.error('   npm run create-admin-manual <UID> <email>');
    console.error('\nÖrnek:');
    console.error('   npm run create-admin-manual abc123xyz admin@example.com');
    process.exit(1);
  }

  try {
    console.log('Admin yetkisi veriliyor...');
    console.log('User ID:', userId);
    console.log('Email:', email);
    
    await setDoc(doc(db, 'admins', userId), {
      email: email,
      isAdmin: true,
      createdAt: new Date(),
    });
    
    console.log('\n✅ Admin yetkisi başarıyla verildi!');
    console.log('📧 Email:', email);
    console.log('🆔 User ID:', userId);
    console.log('\nArtık /admin/login sayfasından giriş yapabilirsiniz.');
    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ Hata oluştu:');
    console.error('Mesaj:', error.message);
    console.error('Kod:', error.code);
    
    if (error.code === 'permission-denied') {
      console.error('\n⚠️  Firestore rules yazma izni vermiyor.');
      console.error('Çözüm: firestore.rules dosyasını güncelleyin veya Firebase Console\'dan manuel olarak ekleyin.');
      console.error('\nManuel ekleme için Firebase Console > Firestore Database > Data sekmesine gidin');
      console.error('admins koleksiyonunu oluşturun ve şu veriyi ekleyin:');
      console.log(JSON.stringify({
        email: email,
        isAdmin: true,
        createdAt: new Date().toISOString(),
      }, null, 2));
    }
    
    process.exit(1);
  }
}

createAdminManual();

