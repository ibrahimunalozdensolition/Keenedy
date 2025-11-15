# Firebase "Account is Flagged" Hatası Çözümü

## Hata
```
This account is flagged, and therefore cannot authorize a third party application.
```

## Sebepleri
1. Google hesabınız güvenlik nedeniyle işaretlenmiş olabilir
2. Çok fazla başarısız giriş denemesi
3. Şüpheli aktivite tespiti
4. Hesap doğrulanmamış

## Çözümler

### 1. Firebase Console Kullanın (Önerilen)
Firebase CLI yerine Firebase Console web arayüzünü kullanın:

1. https://console.firebase.google.com adresine gidin
2. Google hesabınızla giriş yapın
3. Projenizi seçin
4. Firestore Database > Data sekmesinden verileri manuel ekleyin

### 2. Google Hesap Ayarlarını Kontrol Edin
1. https://myaccount.google.com/security adresine gidin
2. "Third-party apps with account access" bölümünü kontrol edin
3. Firebase'e izin verilmiş mi kontrol edin

### 3. Alternatif Hesap Kullanın
- Farklı bir Google hesabı ile Firebase projesi oluşturun
- Veya Firebase projesini başka bir hesaba transfer edin

### 4. Firebase CLI'yi Atlayın
Projede sadece Firestore kullanıyoruz, CLI'ye ihtiyaç yok:
- Verileri Firebase Console'dan ekleyin
- Hosting için Vercel veya başka bir platform kullanın

### 5. Firebase Desteğine Başvurun
Eğer sorun devam ederse:
- Firebase Support: https://firebase.google.com/support
- Hesap durumunuzu kontrol ettirin

## Projede CLI Kullanmadan Çalışma

### Blog Post Ekleme
Firebase Console'dan manuel ekleme yapın (FIREBASE_POST_EKLEME.md dosyasına bakın)

### Hosting
Next.js projesi için Vercel kullanabilirsiniz:
```bash
npm run build
vercel deploy
```

Veya Firebase Hosting için:
1. `npm run build` ile build alın
2. Firebase Console > Hosting'den manuel upload yapın

