const CACHE_NAME = 'lese-trainer-cache-v1';
// Wichtig: Fügen Sie alle Dateien hinzu, die für den Start der App benötigt werden.
const URLS_TO_CACHE = [
  './', // Dies steht für die index.html im Root-Verzeichnis
  './manifest.json',
  './master.json', // Die Master-Liste der Sätze
  './icons/icon-192x192.png',
  './icons/icon-512x512.png'
  // Wenn Sie wissen, dass bestimmte Satzlisten immer verwendet werden,
  // können Sie diese auch hier hinzufügen, z.B. './listen/liste1.json'
];

// Installation des Service Workers: Caching der App-Shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

// Anfragen abfangen und aus dem Cache bedienen
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Wenn die Anfrage im Cache gefunden wird, wird sie von dort zurückgegeben
        if (response) {
          return response;
        }
        // Andernfalls wird die Anfrage an das Netzwerk weitergeleitet
        return fetch(event.request);
      }
    )
  );
});

// Alte Caches löschen, wenn eine neue Version des Service Workers aktiviert wird
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
