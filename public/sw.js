const STATIC_CACHE = 'solve-static-v3'
const CHAT_HISTORY_CACHE = 'chat-history-v1'
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/logo.png',
  '/icons.svg',
  '/pwa-icon.svg',
  '/pwa-maskable.svg',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(APP_SHELL))
      .catch((error) => {
        console.error('SW install 캐시 저장 실패:', error)
        // 설치 실패 시에도 진행되도록 설정 (오프라인 fallback을 위해 이후 재시도 가능)
      }),
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE && key !== CHAT_HISTORY_CACHE)
          .map((key) => caches.delete(key)),
      ),
    ),
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return
  }

  const requestUrl = new URL(event.request.url)

  if (requestUrl.origin !== self.location.origin) {
    return
  }

  if (
    requestUrl.hostname === 'localhost' ||
    requestUrl.pathname.startsWith('/@') ||
    requestUrl.pathname.startsWith('/src/') ||
    requestUrl.pathname.startsWith('/node_modules/') ||
    requestUrl.search.includes('import')
  ) {
    return
  }

  if (requestUrl.pathname === '/api/v1/chat/messages') {
    event.respondWith(
      caches.open(CHAT_HISTORY_CACHE).then(async (cache) => {
        const cachedResponse = await cache.match(event.request)
        const networkFetch = fetch(event.request)
          .then((response) => {
            if (response.ok) {
              void cache.put(event.request, response.clone())
            }

            return response
          })
          .catch(() => cachedResponse || Response.error())

        if (cachedResponse) {
          event.waitUntil(networkFetch.then(() => undefined))
          return cachedResponse
        }

        return networkFetch
      }),
    )
    return
  }

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(async () => {
        const cache = await caches.open(STATIC_CACHE)
        return (await cache.match('/index.html')) || Response.error()
      }),
    )
    return
  }

  event.respondWith(
    caches.match(event.request).then(async (cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse
      }

      try {
        return await fetch(event.request)
      } catch (error) {
        if (event.request.destination === 'image') {
          return (await caches.match('/logo.png')) || Response.error()
        }

        return Response.error()
      }
    }),
  )
})
