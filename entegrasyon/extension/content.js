function showOverlay(message = 'Link Bypass Ediliyor...', subMessage = 'Lütfen bekleyin, link işleniyor.', isError = false) {
  const existingOverlay = document.getElementById('ouo-bypass-overlay');
  if (existingOverlay) {
    existingOverlay.remove();
  }
  
  const overlay = document.createElement('div');
  overlay.id = 'ouo-bypass-overlay';
  
  const spinnerHtml = isError ? '' : `
    <div class="spinner" style="
      width: 50px;
      height: 50px;
      border: 5px solid #f3f3f3;
      border-top: 5px solid ${isError ? '#e74c3c' : '#3498db'};
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    "></div>
  `;
  
  const errorIcon = isError ? `
    <div style="
      width: 60px;
      height: 60px;
      background: #e74c3c;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
      font-size: 30px;
      color: white;
    ">✗</div>
  ` : '';
  
  overlay.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.85);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    ">
      <div style="
        background: white;
        padding: 35px;
        border-radius: 15px;
        text-align: center;
        max-width: 450px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
      ">
        ${isError ? errorIcon : spinnerHtml}
        <h2 style="
          color: ${isError ? '#e74c3c' : '#333'}; 
          margin: 0 0 10px 0;
          font-size: 20px;
          font-weight: 600;
        ">${message}</h2>
        <p style="
          color: #666; 
          margin: 0;
          font-size: 14px;
          line-height: 1.6;
          white-space: pre-line;
        ">${subMessage}</p>
      </div>
    </div>
    <style>
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  `;
  
  if (document.body) {
    document.body.appendChild(overlay);
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      document.body.appendChild(overlay);
    });
  }
}

async function recaptchaV3() {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { action: 'solveRecaptcha' },
      (response) => {
        if (response && response.success) {
          resolve(response.token);
        } else {
          reject(new Error(response?.error || 'reCAPTCHA çözülemedi'));
        }
      }
    );
  });
}

async function aylinkBypassOnPage() {
  const currentUrl = window.location.href;
  
  console.log('ay.link/aylink.co Bypass başlatıldı:', currentUrl);
  
  try {
    const btnMain = document.querySelector('a#btn-main');
    if (btnMain && btnMain.href) {
      console.log('btn-main bypass başarılı:', btnMain.href);
      updateOverlayMessage('Yönlendiriliyor', 'Bypass edildi...');
      
      chrome.runtime.sendMessage({
        action: 'bypassComplete',
        original: currentUrl,
        bypassed: btnMain.href,
        redirectCount: 1
      });
      
      setTimeout(() => {
        window.location.href = btnMain.href;
      }, 500);
      return;
    }
    
    const downloadBtn = document.querySelector('a[href*="click.php"]');
    if (!downloadBtn) {
      const downloadLinks = Array.from(document.querySelectorAll('a')).filter(a => 
        a.textContent.match(/download/i) && a.href && a.href !== 'javascript:;'
      );
      if (downloadLinks.length > 0) {
        const downloadUrl = downloadLinks[0].href;
        console.log('Download link bypass başarılı:', downloadUrl);
        updateOverlayMessage('Yönlendiriliyor', 'Download linki açılıyor...');
        
        chrome.runtime.sendMessage({
          action: 'bypassComplete',
          original: currentUrl,
          bypassed: downloadUrl,
          redirectCount: 1
        });
        
        setTimeout(() => {
          window.location.href = downloadUrl;
        }, 500);
        return;
      }
    } else {
      console.log('click.php bypass başarılı:', downloadBtn.href);
      updateOverlayMessage('Yönlendiriliyor', 'Download linki açılıyor...');
      
      chrome.runtime.sendMessage({
        action: 'bypassComplete',
        original: currentUrl,
        bypassed: downloadBtn.href,
        redirectCount: 1
      });
      
      setTimeout(() => {
        window.location.href = downloadBtn.href;
      }, 500);
      return;
    }
    
    const metaRefresh = document.querySelector('meta[http-equiv="refresh"]');
    if (metaRefresh && metaRefresh.content) {
      const urlMatch = metaRefresh.content.match(/url=(.*)/i);
      if (urlMatch && urlMatch[1]) {
        const finalUrl = urlMatch[1];
        console.log('meta refresh bypass başarılı:', finalUrl);
        
        chrome.runtime.sendMessage({
          action: 'bypassComplete',
          original: currentUrl,
          bypassed: finalUrl,
          redirectCount: 1
        });
        
        window.location.href = finalUrl;
        return;
      }
    }
    
    updateOverlayMessage('Bypass Başarısız', 'Bypass linki bulunamadı.', true);
    setTimeout(() => {
      const overlay = document.getElementById('ouo-bypass-overlay');
      if (overlay) overlay.remove();
    }, 5000);
    
  } catch (error) {
    console.error('ay.link/aylink.co bypass hatası:', error);
    updateOverlayMessage('Hata', `Bypass hatası: ${error.message}`, true);
    setTimeout(() => {
      const overlay = document.getElementById('ouo-bypass-overlay');
      if (overlay) overlay.remove();
    }, 5000);
  }
}

async function ouoBypassOnPage() {
  const currentUrl = window.location.href;
  const originalUrl = currentUrl;
  
  console.log('OUO Bypass başlatıldı:', currentUrl);
  
  try {
    const form = document.querySelector('form');
    
    if (!form) {
      console.log('Form bulunamadı');
      updateOverlayMessage('Form Bulunamadı', 'Sayfa yapısı değişmiş olabilir. Lütfen sayfayı yenileyin.', true);
      setTimeout(() => {
        const overlay = document.getElementById('ouo-bypass-overlay');
        if (overlay) overlay.remove();
      }, 5000);
      return;
    }
    
    const inputs = form.querySelectorAll('input[name$="token"]');
    if (inputs.length === 0) {
      console.log('Token inputları bulunamadı');
      updateOverlayMessage('Token Bulunamadı', 'Sayfa yapısı değişmiş olabilir. Lütfen sayfayı yenileyin.', true);
      setTimeout(() => {
        const overlay = document.getElementById('ouo-bypass-overlay');
        if (overlay) overlay.remove();
      }, 5000);
      return;
    }
    
    console.log('Token keys:', Array.from(inputs).map(i => i.name));
    console.log('reCAPTCHA çözülüyor...');
    
    try {
      const recaptchaToken = await recaptchaV3();
      console.log('reCAPTCHA çözüldü');
      
      let xTokenInput = form.querySelector('input[name="x-token"]');
      if (!xTokenInput) {
        xTokenInput = document.createElement('input');
        xTokenInput.type = 'hidden';
        xTokenInput.name = 'x-token';
        form.appendChild(xTokenInput);
      }
      xTokenInput.value = recaptchaToken;
      
      console.log('Form submit ediliyor...');
      updateOverlayMessage('Form Submit Ediliyor', 'Sayfa otomatik yönlendirilecek...');
      
      chrome.runtime.sendMessage({
        action: 'bypassComplete',
        original: originalUrl,
        bypassed: 'Processing...',
        redirectCount: 1
      });
      
      setTimeout(() => {
        form.submit();
      }, 500);
      
    } catch (e) {
      console.error('reCAPTCHA hatası:', e);
      updateOverlayMessage('reCAPTCHA Hatası', `Hata: ${e.message}. İnternet bağlantınızı kontrol edin.`, true);
      setTimeout(() => {
        const overlay = document.getElementById('ouo-bypass-overlay');
        if (overlay) overlay.remove();
      }, 5000);
    }
    
  } catch (error) {
    console.error('Bypass hatası:', error);
    updateOverlayMessage(
      'Beklenmeyen Hata', 
      `Hata: ${error.message}. Lütfen sayfayı yenileyin veya tekrar deneyin.`, 
      true
    );
    setTimeout(() => {
      const overlay = document.getElementById('ouo-bypass-overlay');
      if (overlay) overlay.remove();
    }, 7000);
  }
}

function updateOverlayMessage(message, subMessage = 'Lütfen bekleyin, link işleniyor.', isError = false) {
  const overlay = document.getElementById('ouo-bypass-overlay');
  if (overlay) {
    const h2 = overlay.querySelector('h2');
    const p = overlay.querySelector('p');
    if (h2) {
      h2.textContent = message;
      h2.style.color = isError ? '#e74c3c' : '#333';
    }
    if (p) {
      p.textContent = subMessage;
    }
    
    if (isError) {
      const spinner = overlay.querySelector('.spinner');
      if (spinner) {
        spinner.style.display = 'none';
      }
    }
  }
}

const currentUrl = window.location.href;

if (currentUrl.includes('ay.link')) {
  showOverlay('Link Bypass Ediliyor', 'ay.link linki bypass ediliyor...');
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', aylinkBypassOnPage);
  } else {
    aylinkBypassOnPage();
  }
} else if (currentUrl.includes('ouo.io') || currentUrl.includes('ouo.press')) {
  let checkInterval;
  let checkCount = 0;
  const maxChecks = 50;
  
  function waitForFormAndBypass() {
    checkCount++;
    
    const form = document.querySelector('form');
    const cloudflareChallenge = document.querySelector('#challenge-running') || 
                                document.querySelector('.cf-browser-verification') ||
                                document.title.includes('Just a moment');
    
    if (cloudflareChallenge && checkCount < maxChecks) {
      if (!document.getElementById('ouo-bypass-overlay')) {
        showOverlay('Cloudflare Kontrolü', 'Cloudflare bot kontrolü bekleniyor... Bu birkaç saniye sürebilir.');
      }
      return;
    }
    
    if (form) {
      clearInterval(checkInterval);
      
      if (!document.getElementById('ouo-bypass-overlay')) {
        showOverlay('Link Bypass Ediliyor', 'Form bulundu, bypass işlemi başlatılıyor...');
      }
      
      ouoBypassOnPage();
    } else if (checkCount >= maxChecks) {
      clearInterval(checkInterval);
      console.error('Form bulunamadı, maksimum deneme sayısına ulaşıldı');
      showOverlay(
        'Zaman Aşımı', 
        'Form 10 saniye içinde bulunamadı. Sayfa manuel olarak yüklenebilir.', 
        true
      );
      setTimeout(() => {
        const overlay = document.getElementById('ouo-bypass-overlay');
        if (overlay) overlay.remove();
      }, 5000);
    }
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      checkInterval = setInterval(waitForFormAndBypass, 200);
    });
  } else {
    checkInterval = setInterval(waitForFormAndBypass, 200);
  }
}

