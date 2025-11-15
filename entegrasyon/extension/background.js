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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'bypassComplete') {
    chrome.storage.local.set({
      lastBypass: {
        original: request.original,
        bypassed: request.bypassed,
        timestamp: Date.now(),
        redirectCount: request.redirectCount || 1
      }
    });
  } else if (request.action === 'solveRecaptcha') {
    recaptchaV3().then(token => {
      sendResponse({ success: true, token: token });
    }).catch(error => {
      sendResponse({ success: false, error: error.message });
    });
    return true;
  }
  return true;
});

