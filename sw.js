// 쏭스터디랩 업무 통합앱 - 앱 화면을 기기에 저장해 빠르게 열리게 합니다.
// 화면을 고친 뒤에는 아래 버전 숫자를 올려 주세요 (예: v2 → v3).
const CACHE = 'ssong-hub-v1';
const SHELL = ['./', './index.html', './manifest.webmanifest', './logo-mark.png',
  './icon-192.png', './icon-512.png', './icon-maskable-192.png', './icon-maskable-512.png', './favicon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return; // 서버(학생 정보) 요청은 저장하지 않음
  e.respondWith(
    fetch(e.request).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return res; })
      .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
