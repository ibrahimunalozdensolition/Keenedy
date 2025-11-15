🔗 LINK BYPASS TOOL (ay.link / aylink.co / tr.link)
====================================================

Python Selenium kullanarak link kısaltıcılarını bypass eder:
- ay.link
- aylink.co
- tr.link


📋 GEREKLİ YAZILIMLAR
=====================

1. Python 3.7+
2. Google Chrome tarayıcı
3. ChromeDriver (otomatik indirilir)


📦 KURULUM
==========

1. Gerekli paketleri yükle:

   pip install -r requirements-aylink.txt

   VEYA manuel olarak:

   pip install selenium webdriver-manager


2. Chrome tarayıcı kurulu olduğundan emin olun


🚀 KULLANIM
===========

Komut satırından çalıştır:

   python3 aylink-bypass.py

Veya modül olarak kullan:

   from aylink_bypass import bypass_aylink
   
   result = bypass_aylink('https://ay.link/xxxxx')
   print(result['bypassed_link'])


💡 ÖZELLİKLER
=============

✅ ay.link desteği (btn-main button)
✅ aylink.co desteği (countdown timer)
✅ tr.link desteği (countdown timer)
✅ 4 farklı bypass yöntemi
✅ Headless/görünür mod seçimi
✅ Detaylı log mesajları
✅ Hata yönetimi


🔍 BYPASS YÖNTEMLERİ
====================

1. btn-main Butonu:
   - ay.link sayfasında #btn-main elementi
   - Direkt href linkini alır

2. "Go to Link" / "Continue" + Countdown:
   - aylink.co ve tr.link için
   - Butona tıklar, countdown bekler (20 saniye)
   - Yönlendirmeyi takip eder

3. Download Butonu + Redirect:
   - Download linkine tıklar
   - click.php redirect'lerini takip eder
   - Spam/affiliate kontrolü yapar

4. Meta Refresh Tag:
   - <meta http-equiv="refresh"> tag'i
   - URL'yi parse eder


⚙️ PARAMETRELER
================

bypass_link(url, headless=True, timeout=30)

  url: ay.link, aylink.co veya tr.link linki
  headless: Tarayıcıyı görünmez modda çalıştır (True/False)
  timeout: Maksimum bekleme süresi (saniye)

Döndürür:
  {
      'original_link': str,
      'bypassed_link': str or None,
      'error': str or None,
      'method': str (hangi yöntem kullanıldı)
  }


📊 ÖRNEK KULLANIM
=================

Terminal:

  $ python3 aylink-bypass.py
  Link girin: https://ay.link/xxxxx
  Tarayıcıyı görünmez modda çalıştır? (E/H): E
  
  ✅ Bypass Edilen Link: https://example.com
  📍 Kullanılan Yöntem: btn-main


Python kodu:

  from aylink_bypass import bypass_link
  
  # ay.link örneği
  url = 'https://ay.link/xxxxx'
  result = bypass_link(url, headless=True)
  
  # tr.link örneği
  url = 'https://tr.link/xxxxx'
  result = bypass_link(url, headless=True)
  
  if result['bypassed_link']:
      print(f"Başarılı: {result['bypassed_link']}")
  else:
      print(f"Hata: {result['error']}")


⚠️ NOTLAR
==========

1. AYLINK.CO SORUNU:
   - aylink.co spam/affiliate yönlendirmesi yapıyor
   - Gerçek link yerine ppcent.org/ppcnt.net gösteriyor
   - Bu durum aylink.co'nun servisi, bizim hatamız değil

2. CHROME DRIVER:
   - İlk çalıştırmada ChromeDriver otomatik indirilir
   - İnternet bağlantısı gerekir

3. HEADLESS MODE:
   - headless=True → Tarayıcı görünmez (hızlı)
   - headless=False → Tarayıcı görünür (debug için)

4. TIMEOUT:
   - Varsayılan 30 saniye
   - Yavaş bağlantılarda artırılabilir


🐛 SORUN GİDERME
================

HATA: "chromedriver not found"
ÇÖZÜM: webdriver-manager paketi otomatik indirir, bekleyin

HATA: "TimeoutException"
ÇÖZÜM: timeout parametresini artırın (60 saniye)

HATA: "NoSuchElementException"
ÇÖZÜM: Sayfa yapısı değişmiş olabilir, scripti güncelleyin

AYLINK.CO SPAM SORUNU:
ÇÖZÜM: aylink.co servisi spam gösteriyor, ay.link kullanın


📜 LİSANS
=========

MIT License - Özgürce kullanabilirsiniz


🤝 KATKIDA BULUNMA
==================

Sorun bulursanız veya iyileştirme öneriniz varsa:
- GitHub issue açın
- Pull request gönderin


İyi kullanımlar! 🚀

