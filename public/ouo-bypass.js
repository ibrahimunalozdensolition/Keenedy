(function() {
  'use strict';

  function showOverlay(message, subMessage, isError) {
    const existingOverlay = document.getElementById('ouo-bypass-overlay');
    if (existingOverlay) {
      existingOverlay.remove();
    }
    
    const overlay = document.createElement('div');
    overlay.id = 'ouo-bypass-overlay';
    overlay.style.cssText = `
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
    `;
    
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

  function updateOverlayMessage(message, subMessage, isError) {
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

  async function recaptchaV3() {
    const ANCHOR_URL = 'https://www.google.com/recaptcha/api2/anchor?ar=1&k=6Lcr1ncUAAAAAH3cghg6cOTPGARa8adOf-y9zv2x&co=aHR0cHM6Ly9vdW8ucHJlc3M6NDQz&hl=en&v=pCoGBhjs9s8EhFOHJFe8cqis&size=invisible&cb=ahgyd1gkfkhe';
    const urlBase = 'https://www.google.com/recaptcha/';
    const postDataTemplate = "v={v}&reason=q&c={c}&k={k}&co={co}";
    
    const matches = ANCHOR_URL.match(/([api2|enterprise]+)\/anchor\?(.*)/);
    if (!matches) throw new Error('Recaptcha URL parse edilemedi');
    
    const endpoint = matches[1];
    const paramsStr = matches[2];
    
    const anchorUrl = `${urlBase}${endpoint}/anchor?${paramsStr}`;
    const response = await fetch(anchorUrl);
    const text = await response.text();
    
    const tokenMatch = text.match(/"recaptcha-token" value="(.*?)"/);
    if (!tokenMatch) throw new Error('Recaptcha token bulunamadı');
    
    const token = tokenMatch[1];
    
    const params = {};
    paramsStr.split('&').forEach(pair => {
      const [key, value] = pair.split('=');
      params[key] = value;
    });
    
    const postData = postDataTemplate
      .replace('{v}', params.v)
      .replace('{c}', token)
      .replace('{k}', params.k)
      .replace('{co}', params.co);
    
    const reloadUrl = `${urlBase}${endpoint}/reload?k=${params.k}`;
    const reloadResponse = await fetch(reloadUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: postData
    });
    
    const reloadText = await reloadResponse.text();
    const answerMatch = reloadText.match(/"rresp","(.*?)"/);
    if (!answerMatch) throw new Error('Recaptcha yanıt bulunamadı');
    
    return answerMatch[1];
  }

  function isShortenerLink(url) {
    if (!url || typeof url !== 'string') return false;
    const shorteners = [
      'ouo.io',
      'ouo.press',
      'ay.link',
      'aylink.co',
      'ay.live',
      'tr.link'
    ];
    return shorteners.some(shortener => url.includes(shortener));
  }

  function startBypassIfNeeded() {
    const currentUrl = window.location.href;
    
    if (isShortenerLink(currentUrl)) {
      console.log('Kısaltıcı link tespit edildi:', currentUrl);
      
      if (currentUrl.includes('ouo.io') || currentUrl.includes('ouo.press')) {
        bypassOuo();
      } else if (currentUrl.includes('ay.link') || currentUrl.includes('aylink.co') || currentUrl.includes('ay.live') || currentUrl.includes('tr.link')) {
        bypassAylink();
      }
    } else {
      const overlay = document.getElementById('ouo-bypass-overlay');
      if (overlay) {
        console.log('Gerçek link bulundu:', currentUrl);
        updateOverlayMessage('Bypass Tamamlandı', 'Gerçek linke yönlendiriliyorsunuz...');
        setTimeout(() => {
          overlay.remove();
        }, 2000);
      }
    }
  }

  async function bypassAylink() {
    const currentUrl = window.location.href;
    console.log('ay.link/aylink.co Bypass başlatıldı:', currentUrl);
    showOverlay('Link Bypass Ediliyor', 'ay.link linki bypass ediliyor...');
    
    let checkCount = 0;
    const maxChecks = 100;
    
    const checkInterval = setInterval(() => {
      checkCount++;
      
      const btnMain = document.querySelector('a#btn-main');
      if (btnMain && btnMain.href) {
        clearInterval(checkInterval);
        console.log('btn-main bypass başarılı:', btnMain.href);
        updateOverlayMessage('Yönlendiriliyor', 'Bypass edildi...');
        
        setTimeout(() => {
          const targetUrl = btnMain.href;
          console.log('ay.link bypass sonrası yönlendiriliyor:', targetUrl);
          window.location.href = targetUrl;
        }, 500);
        return;
      }
      
      const downloadBtn = document.querySelector('a[href*="click.php"]');
      if (downloadBtn) {
        clearInterval(checkInterval);
        console.log('click.php bypass başarılı:', downloadBtn.href);
        updateOverlayMessage('Yönlendiriliyor', 'Download linki açılıyor...');
        
        setTimeout(() => {
          const targetUrl = downloadBtn.href;
          console.log('ay.link bypass sonrası yönlendiriliyor:', targetUrl);
          window.location.href = targetUrl;
        }, 500);
        return;
      }
      
      const metaRefresh = document.querySelector('meta[http-equiv="refresh"]');
      if (metaRefresh && metaRefresh.content) {
        const urlMatch = metaRefresh.content.match(/url=(.*)/i);
        if (urlMatch && urlMatch[1]) {
          clearInterval(checkInterval);
          const finalUrl = urlMatch[1];
          console.log('meta refresh bypass başarılı:', finalUrl);
          
          setTimeout(() => {
            console.log('ay.link bypass sonrası yönlendiriliyor:', finalUrl);
            window.location.href = finalUrl;
          }, 500);
          return;
        }
      }
      
      if (checkCount >= maxChecks) {
        clearInterval(checkInterval);
        console.error('Bypass linki bulunamadı');
        updateOverlayMessage('Bypass Başarısız', 'Bypass linki bulunamadı.', true);
        setTimeout(() => {
          const overlay = document.getElementById('ouo-bypass-overlay');
          if (overlay) overlay.remove();
        }, 5000);
      }
    }, 200);
  }

  async function bypassOuo() {
    const currentUrl = window.location.href;
    const originalUrl = currentUrl;
    
    console.log('OUO Bypass başlatıldı:', currentUrl);
    showOverlay('Link Bypass Ediliyor', 'ouo.io linki bypass ediliyor...');
    
    let checkCount = 0;
    const maxChecks = 50;
    
    const checkInterval = setInterval(async () => {
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
        
        try {
          const inputs = form.querySelectorAll('input[name$="token"]');
          if (inputs.length === 0) {
            throw new Error('Token inputları bulunamadı');
          }
          
          console.log('Token keys:', Array.from(inputs).map(i => i.name));
          console.log('reCAPTCHA çözülüyor...');
          updateOverlayMessage('reCAPTCHA Çözülüyor', 'Lütfen bekleyin...');
          
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
          
          setTimeout(() => {
            console.log('ouo.io form submit ediliyor...');
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
      } else if (checkCount >= maxChecks) {
        clearInterval(checkInterval);
        console.error('Form bulunamadı, maksimum deneme sayısına ulaşıldı');
        updateOverlayMessage('Zaman Aşımı', 'Form 10 saniye içinde bulunamadı. Sayfa manuel olarak yüklenebilir.', true);
        setTimeout(() => {
          const overlay = document.getElementById('ouo-bypass-overlay');
          if (overlay) overlay.remove();
        }, 5000);
      }
    }, 200);
  }

  function init() {
    console.log('ouo-bypass.js yüklendi, URL:', window.location.href);
    
    const checkAndStart = () => {
      console.log('Bypass kontrolü yapılıyor...');
      startBypassIfNeeded();
    };
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', checkAndStart);
    } else {
      setTimeout(checkAndStart, 100);
    }
  }

  if (typeof window !== 'undefined') {
    init();
  }
})();

