#!/usr/bin/env python3
"""
AY.LINK / AY.LIVE / AYLINK.CO / TR.LINK BYPASS TOOL

Selenium kullanarak link kısaltıcılarını bypass eder:
- ay.link (btn-main button)
- ay.live (download button)
- aylink.co (countdown timer)
- tr.link (countdown timer)
"""

import time
import re
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, NoSuchElementException

def setup_driver(headless=True):
    """Chrome driver'ı yapılandır"""
    options = Options()
    if headless:
        options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--disable-blink-features=AutomationControlled')
    options.add_argument('user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
    
    driver = webdriver.Chrome(options=options)
    return driver

def bypass_link(url, headless=True, timeout=30):
    """
    ay.link, ay.live, aylink.co veya tr.link linkini bypass et
    
    Args:
        url: ay.link, ay.live, aylink.co veya tr.link linki
        headless: Tarayıcıyı görünmez modda çalıştır (True/False)
        timeout: Maksimum bekleme süresi (saniye)
    
    Returns:
        dict: {
            'original_link': str,
            'bypassed_link': str or None,
            'error': str or None,
            'method': str (hangi yöntem kullanıldı)
        }
    """
    
    driver = None
    
    try:
        print(f"🔗 İşleniyor: {url}")
        
        driver = setup_driver(headless=headless)
        driver.get(url)
        
        wait = WebDriverWait(driver, timeout)
        
        # Yöntem 1: btn-main butonu (ay.link)
        try:
            print("📍 Yöntem 1: btn-main butonu aranıyor...")
            btn_main = wait.until(
                EC.presence_of_element_located((By.ID, "btn-main"))
            )
            
            if btn_main and btn_main.get_attribute('href'):
                final_url = btn_main.get_attribute('href')
                
                # JavaScript linki değilse
                if not final_url.startswith('javascript:'):
                    print(f"✅ btn-main ile bulundu: {final_url}")
                    return {
                        'original_link': url,
                        'bypassed_link': final_url,
                        'error': None,
                        'method': 'btn-main'
                    }
            
            print("⚠️  btn-main var ama href yok veya javascript:")
        
        except TimeoutException:
            print("⚠️  btn-main bulunamadı, diğer yöntemlere geçiliyor...")
        
        # Yöntem 2: "Go to Link" / "Continue" butonu + bekleme (aylink.co, tr.link)
        # ay.live için countdown yok, direkt link kontrolüne geç
        if 'ay.live' not in url:
            try:
                print("📍 Yöntem 2: 'Go to Link' / 'Continue' butonu aranıyor...")
                go_btn = driver.find_element(By.XPATH, 
                    "//a[contains(text(), 'Go to Link') or contains(text(), 'Continue') or contains(text(), 'Devam') or contains(@class, 'btn-go') or contains(@class, 'btn-continue')]"
                )
                
                if go_btn:
                    print("✅ Devam butonu bulundu, tıklanıyor...")
                    go_btn.click()
                    
                    # Countdown bekle (max 20 saniye)
                    print("⏳ Countdown bekleniyor (20 saniye)...")
                    time.sleep(20)
                
                    # Yeni URL'yi kontrol et
                    current_url = driver.current_url
                    if current_url != url and 'aylink' not in current_url and 'tr.link' not in current_url:
                        print(f"✅ Yönlendirme tespit edildi: {current_url}")
                        return {
                            'original_link': url,
                            'bypassed_link': current_url,
                            'error': None,
                            'method': 'go-button-countdown'
                        }
                    
                    # Sayfada yeni link var mı kontrol et
                    try:
                        download_btn = driver.find_element(By.XPATH, "//a[contains(text(), 'Download') or contains(text(), 'Continue')]")
                        if download_btn and download_btn.get_attribute('href'):
                            final_url = download_btn.get_attribute('href')
                            if not final_url.startswith('javascript:'):
                                print(f"✅ Download butonu ile bulundu: {final_url}")
                                return {
                                    'original_link': url,
                                    'bypassed_link': final_url,
                                    'error': None,
                                    'method': 'download-button'
                                }
                    except NoSuchElementException:
                        pass
            
            except NoSuchElementException:
                print("⚠️  'Go to Link' butonu bulunamadı...")
        
        # Yöntem 3: Download butonu (aylink.co, ay.live)
        try:
            print("📍 Yöntem 3: Download butonu aranıyor...")
            
            # ay.live için tüm linkleri kontrol et
            if 'ay.live' in url:
                all_links = driver.find_elements(By.TAG_NAME, "a")
                print(f"   Toplam {len(all_links)} link bulundu, inceleniyor...")
                
                for link in all_links:
                    href = link.get_attribute('href')
                    text = link.text.strip()
                    
                    if href and not href.startswith('javascript:'):
                        # ay.live domain'i dışındaki linkler (YouTube, vb.)
                        if 'ay.live' not in href and href.startswith('http'):
                            # Report Link, Terms of Use gibi linkleri atla
                            if text and text not in ['Report Link', 'Terms of Use', '']:
                                print(f"✅ Harici link bulundu: {href[:100]}...")
                                print(f"   Link metni: {text}")
                                
                                # click.php linki ise takip et
                                if 'click.php' in href or 'aylink.co' in href:
                                    print(f"   click.php redirect'i takip ediliyor...")
                                    driver.get(href)
                                    time.sleep(3)
                                    
                                    final_url = driver.current_url
                                    
                                    # Eğer yönlendirildi ise
                                    if final_url != href:
                                        print(f"✅ Final URL: {final_url}")
                                        return {
                                            'original_link': url,
                                            'bypassed_link': final_url,
                                            'error': None,
                                            'method': 'external-link-redirect'
                                        }
                                
                                # Direkt link (YouTube, vb.)
                                return {
                                    'original_link': url,
                                    'bypassed_link': href,
                                    'error': None,
                                    'method': 'external-link'
                                }
            
            # Genel Download butonları
            download_links = driver.find_elements(By.XPATH, 
                "//a[contains(text(), 'Download') or contains(text(), 'Watch Download')]"
            )
            
            for dl_link in download_links:
                href = dl_link.get_attribute('href')
                if href and not href.startswith('javascript:'):
                    print(f"✅ Download linki bulundu: {href[:80]}...")
                    
                    # aylink.co için click.php kontrolü
                    if 'click.php' in href:
                        # click.php'ye git ve redirect'leri takip et
                        driver.get(href)
                        time.sleep(3)
                        
                        final_url = driver.current_url
                        
                        # Spam/affiliate değilse başarılı
                        if 'ppcent' not in final_url and 'ppcnt' not in final_url:
                            print(f"✅ Final URL: {final_url}")
                            return {
                                'original_link': url,
                                'bypassed_link': final_url,
                                'error': None,
                                'method': 'download-link-redirect'
                            }
                        else:
                            print(f"⚠️  Spam/affiliate linki: {final_url}")
        
        except NoSuchElementException:
            print("⚠️  Download butonu bulunamadı...")
        
        # Yöntem 4: Meta refresh
        try:
            print("📍 Yöntem 4: Meta refresh tag'i aranıyor...")
            meta_tag = driver.find_element(By.XPATH, "//meta[@http-equiv='refresh']")
            
            if meta_tag:
                content = meta_tag.get_attribute('content')
                url_match = re.search(r'url=(.*)', content, re.IGNORECASE)
                
                if url_match:
                    final_url = url_match.group(1)
                    print(f"✅ Meta refresh ile bulundu: {final_url}")
                    return {
                        'original_link': url,
                        'bypassed_link': final_url,
                        'error': None,
                        'method': 'meta-refresh'
                    }
        
        except NoSuchElementException:
            print("⚠️  Meta refresh bulunamadı...")
        
        # Hiçbir yöntem çalışmadı
        print("❌ Bypass başarısız - hiçbir yöntem çalışmadı")
        return {
            'original_link': url,
            'bypassed_link': None,
            'error': 'Bypass linki bulunamadı - tüm yöntemler denendi',
            'method': None
        }
    
    except Exception as e:
        print(f"❌ Hata: {e}")
        return {
            'original_link': url,
            'bypassed_link': None,
            'error': str(e),
            'method': None
        }
    
    finally:
        if driver:
            driver.quit()

def main():
    """Ana program"""
    print("=" * 70)
    print("🔗 LINK BYPASS TOOL (ay.link / ay.live / aylink.co / tr.link)")
    print("=" * 70)
    print()
    
    while True:
        url = input("Link girin (çıkmak için 'exit'): ").strip()
        
        if url.lower() in ['exit', 'q', 'quit']:
            print("👋 Programdan çıkılıyor...")
            break
        
        if not url:
            print("❌ Lütfen geçerli bir link girin!")
            continue
        
        if not any(domain in url for domain in ['ay.link', 'ay.live', 'aylink.co', 'tr.link']):
            print("❌ Bu bir ay.link, ay.live, aylink.co veya tr.link linki değil!")
            continue
        
        # Headless mode seçimi
        headless_input = input("Tarayıcıyı görünmez modda çalıştır? (E/H, varsayılan: E): ").strip().upper()
        headless = headless_input != 'H'
        
        print()
        print("🚀 Bypass işlemi başlatılıyor...")
        print("-" * 60)
        
        result = bypass_link(url, headless=headless)
        
        print()
        print("=" * 60)
        print("📊 SONUÇ")
        print("=" * 60)
        print(f"Orijinal Link: {result['original_link']}")
        
        if result['bypassed_link']:
            print(f"✅ Bypass Edilen Link: {result['bypassed_link']}")
            print(f"📍 Kullanılan Yöntem: {result['method']}")
        else:
            print(f"❌ Hata: {result['error']}")
        
        print("=" * 60)
        print()

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n👋 Program kullanıcı tarafından sonlandırıldı.")
    except Exception as e:
        print(f"\n❌ Beklenmeyen hata: {e}")

