# Firebase'e Blog Post Ekleme

## Yöntem 1: Script ile Otomatik Ekleme

1. `.env.local` dosyası oluşturun ve Firebase config değerlerinizi ekleyin:
```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

2. Firestore rules'u geçici olarak güncelleyin (`firestore.rules`):
```
allow write: if true;
```

3. Script'i çalıştırın:
```bash
npm run create-post
```

4. Rules'u tekrar güvenli hale getirin:
```
allow write: if false;
```

## Yöntem 2: Firebase Console'dan Manuel Ekleme

1. Firebase Console'a gidin: https://console.firebase.google.com
2. Projenizi seçin
3. Firestore Database > Data sekmesine gidin
4. `blogPosts` koleksiyonunu oluşturun (yoksa)
5. "Add document" butonuna tıklayın
6. `scripts/manual-post-data.json` dosyasındaki verileri kopyalayıp ekleyin
7. `createdAt` alanı için Timestamp tipini seçin ve mevcut tarih/saat'i girin

## Mariechi Post Verileri

- **Slug**: `mariechi-robotik-cihaz`
- **Görsel**: `/mariechi-device.png` (public klasöründe)
- **Yönlendirme URL**: `https://sarust.tech`

