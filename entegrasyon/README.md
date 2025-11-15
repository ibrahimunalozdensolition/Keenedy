# 🔗 Link Bypass Entegrasyon Araçları

Bu klasör, link kısaltıcı servislerini bypass etmek için geliştirilmiş Python ve Chrome Extension araçlarını içerir.

## 📋 İçindekiler

- [Genel Bakış](#genel-bakış)
- [Bileşenler](#bileşenler)
- [Python Selenium Aracı](#python-selenium-aracı)
- [Chrome Extension](#chrome-extension)
- [Kurulum](#kurulum)
- [Kullanım](#kullanım)
- [Teknolojiler](#teknolojiler)
- [Mimari](#mimari)

---

## 🎯 Genel Bakış

Bu entegrasyon araçları, popüler link kısaltıcı servislerinin bypass edilmesini sağlar:

- **ay.link** - Türk link kısaltıcı servisi
- **ay.live** - Alternatif link kısaltıcı servisi
- **aylink.co** - Link kısaltıcı servisi
- **tr.link** - Türk link kısaltıcı servisi
- **ouo.io** - Popüler link kısaltıcı servisi
- **ouo.press** - Ouo.io alternatifi

### Amaç

Link kısaltıcı servisler, kullanıcıları reCAPTCHA, countdown timer ve reklam sayfalarından geçirerek gerçek linke yönlendirir. Bu araçlar, bu ara adımları otomatik olarak atlayarak doğrudan hedef linke ulaşmayı sağlar.

---

## 🧩 Bileşenler

### 1. Python Selenium Aracı (`aylink-bypass.py`)

**Amaç:** ay.link, ay.live, aylink.co ve tr.link servislerini bypass etmek için Python tabanlı otomatik tarayıcı aracı.

**Çözüm Yöntemi:** Selenium WebDriver kullanarak tarayıcı otomasyonu ile sayfayı yükler, DOM elementlerini analiz eder ve gerçek linki çıkarır.

**Kullanılan Teknolojiler:**
- Python 3.7+
- Selenium WebDriver
- Chrome/Chromium tarayıcı
- WebDriver Manager (otomatik driver yönetimi)

**Bypass Yöntemleri:**
1. **btn-main Butonu:** ay.link sayfasında `#btn-main` elementinin `href` özelliğini okur
2. **Go to Link Butonu + Countdown:** aylink.co ve tr.link için butona tıklar, countdown bekler
3. **Download Butonu + Redirect:** Download linkine tıklar, `click.php` redirect'lerini takip eder
4. **Meta Refresh Tag:** `<meta http-equiv="refresh">` tag'inden URL'yi parse eder
5. **Harici Link Analizi:** ay.live için sayfadaki tüm linkleri analiz eder

### 2. Chrome Extension (`extension/`)

**Amaç:** ouo.io, ouo.press ve ay.link linklerini tarayıcı içinde otomatik bypass etmek için Chrome uzantısı.

**Çözüm Yöntemi:** Content script ile sayfa içinde çalışır, reCAPTCHA v3 çözümlemesi yapar ve form submit eder.

**Kullanılan Teknolojiler:**
- Chrome Extension Manifest V3
- JavaScript (ES6+)
- Chrome Storage API
- Chrome Tabs API
- Google reCAPTCHA v3 API

**Bypass Yöntemleri:**
1. **OUO Bypass:** Form token'larını bulur, reCAPTCHA çözer, form submit eder
2. **AY.LINK Bypass:** `#btn-main` elementini bulur, direkt yönlendirir
3. **Download Link:** `click.php` linklerini takip eder
4. **Meta Refresh:** Meta tag'inden URL çıkarır

---

## 🚀 Kurulum

### Python Selenium Aracı

#### Gereksinimler
- Python 3.7 veya üzeri
- Google Chrome veya Chromium tarayıcı
- İnternet bağlantısı (ChromeDriver otomatik indirme için)

#### Adımlar

1. **Gerekli paketleri yükleyin:**
```bash
cd entegrasyon
pip install -r requirements-aylink.txt
```

2. **Manuel kurulum (alternatif):**
```bash
pip install selenium webdriver-manager
```

3. **Chrome tarayıcının kurulu olduğundan emin olun**

### Chrome Extension

#### Adımlar

1. Chrome tarayıcınızı açın
2. Adres çubuğuna `chrome://extensions/` yazın
3. Sağ üst köşede **"Geliştirici modu"** (Developer mode) seçeneğini aktif edin
4. **"Paketlenmemiş öğe yükle"** (Load unpacked) butonuna tıklayın
5. `entegrasyon/extension/` klasörünü seçin
6. Uzantı başarıyla yüklenecek!

---

## 💻 Kullanım

### Python Selenium Aracı

#### Komut Satırı Kullanımı

```bash
python3 aylink-bypass.py
```

Program interaktif modda çalışır:
- Link girmenizi ister
- Headless mod seçimi yaparsınız
- Bypass sonucunu gösterir

**Örnek:**
```
Link girin: https://ay.link/xxxxx
Tarayıcıyı görünmez modda çalıştır? (E/H, varsayılan: E): E

✅ Bypass Edilen Link: https://example.com
📍 Kullanılan Yöntem: btn-main
```

#### Python Modül Olarak Kullanım

```python
from aylink_bypass import bypass_link

# ay.link örneği
url = 'https://ay.link/xxxxx'
result = bypass_link(url, headless=True, timeout=30)

if result['bypassed_link']:
    print(f"Başarılı: {result['bypassed_link']}")
    print(f"Yöntem: {result['method']}")
else:
    print(f"Hata: {result['error']}")
```

#### Fonksiyon Parametreleri

```python
bypass_link(url, headless=True, timeout=30)
```

- **url** (str): ay.link, ay.live, aylink.co veya tr.link linki
- **headless** (bool): Tarayıcıyı görünmez modda çalıştır (varsayılan: True)
- **timeout** (int): Maksimum bekleme süresi saniye cinsinden (varsayılan: 30)

#### Dönen Değer

```python
{
    'original_link': str,      # Orijinal kısaltılmış link
    'bypassed_link': str or None,  # Bypass edilmiş gerçek link
    'error': str or None,      # Hata mesajı (varsa)
    'method': str or None      # Kullanılan bypass yöntemi
}
```

### Chrome Extension

#### Otomatik Mod

1. Herhangi bir ouo.io, ouo.press veya ay.link linkine gidin
2. Uzantı otomatik olarak bypass işlemini başlatır
3. Overlay ekranı bypass durumunu gösterir
4. İşlem tamamlandığında otomatik yönlendirme yapılır

#### Manuel Mod

1. Uzantı ikonuna tıklayın
2. Popup penceresinde link girin
3. "Bypass Et" butonuna tıklayın
4. Link yeni sekmede açılır ve otomatik bypass edilir

#### Son Bypass Geçmişi

Popup penceresinde son bypass edilen link bilgileri gösterilir:
- Orijinal link
- Bypass edilen link
- Tarih/saat
- Yönlendirme adım sayısı

---

## 🔧 Teknolojiler

### Python Selenium Aracı

| Teknoloji | Versiyon | Amaç |
|-----------|----------|------|
| Python | 3.7+ | Programlama dili |
| Selenium | 4.15.0+ | Web tarayıcı otomasyonu |
| WebDriver Manager | 4.0.0+ | ChromeDriver otomatik yönetimi |
| Chrome/Chromium | Latest | Tarayıcı motoru |

### Chrome Extension

| Teknoloji | Versiyon | Amaç |
|-----------|----------|------|
| Chrome Extension API | Manifest V3 | Uzantı altyapısı |
| JavaScript | ES6+ | Programlama dili |
| Chrome Storage API | - | Veri saklama |
| Chrome Tabs API | - | Sekme yönetimi |
| Google reCAPTCHA v3 | - | Bot doğrulama çözümü |

---

## 🏗️ Mimari

### Python Selenium Aracı Akışı

```
1. URL alınır
2. Chrome driver başlatılır (headless/görünür)
3. Sayfa yüklenir
4. DOM analizi yapılır:
   ├─ btn-main butonu kontrolü
   ├─ Go to Link butonu kontrolü
   ├─ Download butonu kontrolü
   ├─ Meta refresh tag kontrolü
   └─ Harici link analizi (ay.live)
5. Gerçek link çıkarılır
6. Sonuç döndürülür
7. Driver kapatılır
```

### Chrome Extension Akışı

```
1. Kullanıcı linke gider
2. Content script sayfaya enjekte edilir
3. Domain kontrolü yapılır:
   ├─ ouo.io/ouo.press → OUO bypass
   └─ ay.link → AY.LINK bypass
4. Overlay gösterilir
5. Bypass işlemi başlatılır:
   ├─ Form bulunur (OUO)
   ├─ reCAPTCHA çözülür (OUO)
   ├─ Form submit edilir (OUO)
   └─ btn-main bulunur (AY.LINK)
6. Sonuç storage'a kaydedilir
7. Yönlendirme yapılır
8. Overlay kaldırılır
```

### Dosya Yapısı

```
entegrasyon/
├── aylink-bypass.py          # Python Selenium bypass aracı
├── test_ay_live.py           # ay.live test scripti
├── requirements.txt           # Genel Python bağımlılıkları
├── requirements-aylink.txt   # Selenium bağımlılıkları
├── AYLINK-README.txt         # Eski dokümantasyon
├── README.md                  # Bu dosya
└── extension/                # Chrome Extension
    ├── manifest.json         # Uzantı yapılandırması
    ├── background.js         # Service worker (arka plan)
    ├── content.js            # Content script (sayfa içi)
    ├── popup.html            # Popup arayüzü
    ├── popup.js              # Popup mantığı
    ├── popup.css             # Popup stilleri
    ├── KURULUM.txt           # Kurulum talimatları
    └── icons/                # Uzantı ikonları
        ├── icon16.png
        ├── icon48.png
        └── icon128.png
```

---

## 🔍 Bypass Yöntemleri Detayı

### 1. btn-main Butonu (ay.link)

**Nasıl Çalışır:**
- ay.link sayfasında `#btn-main` ID'li `<a>` elementi aranır
- Elementin `href` özelliği okunur
- JavaScript linki değilse direkt kullanılır

**Kod:**
```python
btn_main = driver.find_element(By.ID, "btn-main")
final_url = btn_main.get_attribute('href')
```

### 2. Go to Link + Countdown (aylink.co, tr.link)

**Nasıl Çalışır:**
- "Go to Link" veya "Continue" butonu bulunur
- Butona tıklanır
- 20 saniye countdown beklenir
- Yeni URL kontrol edilir

**Kod:**
```python
go_btn = driver.find_element(By.XPATH, 
    "//a[contains(text(), 'Go to Link')]"
)
go_btn.click()
time.sleep(20)
```

### 3. Download Butonu + Redirect (aylink.co, ay.live)

**Nasıl Çalışır:**
- Download linki bulunur
- `click.php` içeriyorsa takip edilir
- Redirect'ler takip edilir
- Spam/affiliate kontrolü yapılır

**Kod:**
```python
download_btn = driver.find_element(By.XPATH, 
    "//a[contains(text(), 'Download')]"
)
driver.get(download_btn.href)
time.sleep(3)
```

### 4. Meta Refresh Tag

**Nasıl Çalışır:**
- `<meta http-equiv="refresh">` tag'i aranır
- `content` özelliğinden URL parse edilir
- Regex ile URL çıkarılır

**Kod:**
```python
meta_tag = driver.find_element(By.XPATH, 
    "//meta[@http-equiv='refresh']"
)
url_match = re.search(r'url=(.*)', content)
```

### 5. reCAPTCHA v3 Çözümü (OUO)

**Nasıl Çalışır:**
- Google reCAPTCHA v3 anchor URL'i parse edilir
- Token alınır
- Reload endpoint'ine POST yapılır
- Yanıttan token çıkarılır
- Form'a `x-token` olarak eklenir

**Kod:**
```javascript
const token = await recaptchaV3();
xTokenInput.value = token;
form.submit();
```

---

## ⚙️ Yapılandırma

### Python Aracı

**Headless Mod:**
- `headless=True`: Tarayıcı görünmez (hızlı, sunucu için ideal)
- `headless=False`: Tarayıcı görünür (debug için)

**Timeout:**
- Varsayılan: 30 saniye
- Yavaş bağlantılarda artırılabilir: `timeout=60`

### Chrome Extension

**İzinler:**
- `tabs`: Sekme yönetimi için
- `storage`: Bypass geçmişi için
- `host_permissions`: ouo.io, ouo.press, ay.link erişimi için

**Content Script:**
- `run_at: "document_start"`: Sayfa yüklenmeden önce çalışır
- `all_frames: false`: Sadece ana frame'de çalışır

---

## 🐛 Sorun Giderme

### Python Aracı

**Hata: "chromedriver not found"**
- **Çözüm:** WebDriver Manager otomatik indirir, bekleyin veya manuel ChromeDriver kurun

**Hata: "TimeoutException"**
- **Çözüm:** `timeout` parametresini artırın (örn: `timeout=60`)

**Hata: "NoSuchElementException"**
- **Çözüm:** Sayfa yapısı değişmiş olabilir, scripti güncelleyin

**aylink.co spam sorunu:**
- **Çözüm:** aylink.co servisi spam gösteriyor, ay.link kullanın

### Chrome Extension

**Uzantı çalışmıyor:**
- Geliştirici modunun açık olduğundan emin olun
- Sayfayı yenileyin (F5)
- Uzantıyı devre dışı bırakıp tekrar aktif edin

**reCAPTCHA çözülemiyor:**
- İnternet bağlantınızı kontrol edin
- Google servislerine erişim olduğundan emin olun
- Sayfayı yenileyip tekrar deneyin

**Form bulunamıyor:**
- Sayfa tamamen yüklendiğinden emin olun
- Cloudflare kontrolü bekleniyor olabilir
- Sayfayı manuel yenileyin

---

## 📊 Performans

### Python Aracı

- **Ortalama bypass süresi:** 5-15 saniye
- **Headless mod:** Daha hızlı (3-8 saniye)
- **Görünür mod:** Daha yavaş (10-20 saniye)

### Chrome Extension

- **OUO bypass:** 2-5 saniye (reCAPTCHA çözümüne bağlı)
- **AY.LINK bypass:** 1-2 saniye (anında)

---

## 🔒 Güvenlik ve Etik

### Önemli Notlar

1. **Bu araçlar sadece eğitim ve kişisel kullanım içindir**
2. **Link kısaltıcı servislerin kullanım şartlarını ihlal edebilir**
3. **Ticari kullanım için servis sağlayıcıdan izin alınmalıdır**
4. **reCAPTCHA bypass'ı Google'ın hizmet şartlarını ihlal edebilir**

### Sorumluluk Reddi

Bu araçlar "olduğu gibi" sağlanmaktadır. Kullanıcılar kendi sorumluluklarında kullanırlar.

---

## 📝 Lisans

MIT License - Özgürce kullanabilirsiniz

---

## 🤝 Katkıda Bulunma

Sorun bulursanız veya iyileştirme öneriniz varsa:
- GitHub issue açın
- Pull request gönderin
- Dokümantasyonu geliştirin

---

## 📚 Kaynaklar

- [Selenium WebDriver Dokümantasyonu](https://www.selenium.dev/documentation/)
- [Chrome Extension Dokümantasyonu](https://developer.chrome.com/docs/extensions/)
- [reCAPTCHA v3 Dokümantasyonu](https://developers.google.com/recaptcha/docs/v3)

---

**Son Güncelleme:** 2025

**Versiyon:** 1.1.0

**Geliştirici:** Kennedy Project Team

