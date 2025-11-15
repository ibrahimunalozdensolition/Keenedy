import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('HATA: Firebase yapılandırması eksik!');
  console.error('Lütfen .env.local dosyasında NEXT_PUBLIC_FIREBASE_* değişkenlerini ayarlayın.');
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function createPost() {
  const slug = 'mariechi-robotik-cihaz';
  
  const postData = {
    title: 'Mariechi Robotik Cihaz: Geleceğin Teknolojisi',
    image: '/mariechi-device.png',
    description: 'Mavi renkli, altıgen desenli yüzeyiyle dikkat çeken Mariechi robotik cihazı, sarust.tech tarafından geliştirilmiş yenilikçi bir teknoloji ürünü. Modern tasarımı ve gelişmiş özellikleriyle geleceğin robotik çözümlerine öncülük ediyor.',
    content: `Mariechi robotik cihazı, sarust.tech tarafından geliştirilmiş, geleceğin teknolojisini bugüne taşıyan bir üründür.

Cihazın en dikkat çekici özellikleri:

**Tasarım ve Görünüm**
- Mavi renkli, altıgen desenli yüzey yapısı
- Modern ve estetik görünüm
- Sarust.tech markası ile öne çıkan tasarım

**Teknik Özellikler**
- Gelişmiş sensör sistemleri
- Hareket kabiliyeti için tekerlekli yapı
- Işık yansımaları ve görsel geri bildirim sistemleri

**Kullanım Alanları**
Bu robotik cihaz, çeşitli endüstriyel ve ticari uygulamalarda kullanılmak üzere tasarlanmıştır. Modern teknoloji ile geleneksel işlevselliği bir araya getiren Mariechi, geleceğin akıllı cihazlarına örnek teşkil etmektedir.

Daha fazla bilgi için sarust.tech'i ziyaret edebilirsiniz.`,
    redirectUrl: 'https://sarust.tech',
    slug: slug,
    createdAt: Timestamp.now(),
  };

  try {
    console.log('Firebase\'e bağlanılıyor...');
    console.log('Project ID:', firebaseConfig.projectId);
    
    const docRef = await addDoc(collection(db, 'blogPosts'), postData);
    console.log('\n✅ Blog post başarıyla oluşturuldu!');
    console.log('📝 Post ID:', docRef.id);
    console.log('🔗 Post URL:', `/blog/${slug}`);
    console.log('\nNot: Eğer Firestore rules yazma izni vermiyorsa, Firebase Console\'dan manuel olarak ekleyebilirsiniz.');
    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ Hata oluştu:');
    console.error('Mesaj:', error.message);
    console.error('Kod:', error.code);
    
    if (error.code === 'permission-denied') {
      console.error('\n⚠️  Firestore rules yazma izni vermiyor.');
      console.error('Çözüm: Firebase Console\'dan manuel olarak ekleyin veya firestore.rules dosyasını güncelleyin.');
      console.error('\nManuel ekleme için Firebase Console\'da blogPosts koleksiyonuna şu veriyi ekleyin:');
      console.log(JSON.stringify(postData, null, 2));
    }
    
    process.exit(1);
  }
}

createPost();

