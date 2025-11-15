import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';

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

async function createPost() {
  const slug = 'mariechi-robotik-cihaz';
  
  const postData = {
    title: 'Mariechi Robotik Cihaz: Geleceğin Teknolojisi',
    image: '/mariechi-robotik-cihaz.png',
    description: 'Mavi renkli, altıgen desenli yüzeyiyle dikkat çeken Mariechi robotik cihazı, sarust.tech tarafından geliştirilmiş yenilikçi bir teknoloji ürünü. Modern tasarımı ve gelişmiş özellikleriyle geleceğin robotik çözümlerine öncülük ediyor.',
    content: `Mariechi robotik cihazı, sarust.tech tarafından geliştirilmiş, geleceğin teknolojisini bugüne taşıyan bir üründür.

Cihazın en dikkat çekici özellikleri:

**Tasarım ve Görünüm**
- Mavi renkli, altıgen desenli yüzey yapısı
- Modern ve estetik görünüm
- Mariechi ve sarust.tech markaları ile öne çıkan tasarım
- Hexagonal pattern ile teknolojik görünüm

**Teknik Özellikler**
- Gelişmiş sensör sistemleri
- Hareket kabiliyeti için tekerlekli yapı (caster wheel ve ana tekerlek)
- Işık yansımaları ve görsel geri bildirim sistemleri
- Ventilasyon sistemleri ile soğutma
- Sensör ve gösterge sistemleri

**Kullanım Alanları**
Bu robotik cihaz, çeşitli endüstriyel ve ticari uygulamalarda kullanılmak üzere tasarlanmıştır. Modern teknoloji ile geleneksel işlevselliği bir araya getiren Mariechi, geleceğin akıllı cihazlarına örnek teşkil etmektedir.

Daha fazla bilgi için sarust.tech'i ziyaret edebilirsiniz.`,
    redirectUrl: 'https://sarust.tech',
    slug: slug.toLowerCase(),
    tags: ['robotik', 'teknoloji', 'mariechi', 'sarust.tech', 'cihaz', 'kennedy'].map(tag => tag.toLowerCase()),
    createdAt: Timestamp.now(),
  };

  try {
    console.log('Firebase\'e bağlanılıyor...');
    console.log('Project ID: kennedy-4135f');
    
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

