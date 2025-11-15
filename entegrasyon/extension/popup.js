document.addEventListener('DOMContentLoaded', function() {
  const urlInput = document.getElementById('urlInput');
  const bypassBtn = document.getElementById('bypassBtn');
  const resultDiv = document.getElementById('result');
  const lastBypassDiv = document.getElementById('lastBypass');

  loadLastBypass();

  bypassBtn.addEventListener('click', async () => {
    const url = urlInput.value.trim();
    
    if (!url) {
      showResult('error', 'Lütfen bir link girin!');
      return;
    }

    if (!isOuoLink(url)) {
      showResult('error', 'Bu bir ouo.io, ouo.press veya ay.link linki değil!');
      return;
    }

    showResult('success', 'Link yeni sekmede açılıyor ve bypass edilecek...');
    chrome.tabs.create({ url: url });
    
    setTimeout(() => {
      loadLastBypass();
    }, 2000);
  });

  urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      bypassBtn.click();
    }
  });

  function showResult(type, message) {
    resultDiv.className = `result ${type}`;
    resultDiv.innerHTML = message;
    resultDiv.classList.remove('hidden');
  }

  function isOuoLink(url) {
    return url.includes('ouo.io') || url.includes('ouo.press') || url.includes('ay.link');
  }

  async function loadLastBypass() {
    const data = await chrome.storage.local.get('lastBypass');
    
    if (data.lastBypass) {
      const { original, bypassed, timestamp, redirectCount } = data.lastBypass;
      const date = new Date(timestamp);
      
      lastBypassDiv.innerHTML = `
        <div class="stats-item">
          <strong>Orijinal Link:</strong>
          <span>${truncateUrl(original)}</span>
        </div>
        <div class="stats-item">
          <strong>Bypass Edilen:</strong>
          <span><a href="${bypassed}" target="_blank">${truncateUrl(bypassed)}</a></span>
        </div>
        <div class="stats-item">
          <strong>Tarih:</strong>
          <span>${date.toLocaleString('tr-TR')}</span>
        </div>
        ${redirectCount > 1 ? `
        <div class="stats-item">
          <strong>Yönlendirme:</strong>
          <span>${redirectCount} adım</span>
        </div>
        ` : ''}
      `;
    }
  }

  function truncateUrl(url, maxLength = 50) {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
  }
});

