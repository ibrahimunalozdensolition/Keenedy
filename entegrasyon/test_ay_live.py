#!/usr/bin/env python3
"""ay.live test scripti"""

import sys
import importlib.util

# aylink-bypass.py dosyasını modül olarak yükle
spec = importlib.util.spec_from_file_location("aylink_bypass", "aylink-bypass.py")
aylink_bypass = importlib.util.module_from_spec(spec)
spec.loader.exec_module(aylink_bypass)

# Test
url = 'https://ay.live/tgVF'
print('🧪 TEST: ay.live bypass (YouTube kanalı)')
print('=' * 70)
print(f'Link: {url}')
print()

result = aylink_bypass.bypass_link(url, headless=True, timeout=30)

print()
print('=' * 70)
print('📊 SONUÇ')
print('=' * 70)
print(f'✅ Orijinal: {result["original_link"]}')

if result["bypassed_link"]:
    print(f'✅ Bypass Edilen: {result["bypassed_link"]}')
    print(f'✅ Yöntem: {result["method"]}')
    
    # YouTube linki mi kontrol et
    if 'youtube.com' in result["bypassed_link"] or 'youtu.be' in result["bypassed_link"]:
        print('✅ YouTube linki başarıyla çıkarıldı!')
    else:
        print(f'⚠️  Beklenmeyen link türü')
else:
    print(f'❌ Hata: {result["error"]}')

print('=' * 70)

