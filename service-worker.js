"use strict";

const CACHE_NAME = "campbellweb-shell-20260804-project12";
const scopeUrl = (path) => new URL(path, self.registration.scope).toString();
const OFFLINE_PAGE = scopeUrl("offline.html");
const CORE_ASSETS = [
  scopeUrl("./"),
  scopeUrl("index.html"),
  OFFLINE_PAGE,
  scopeUrl("style.css?v=20260804-project12"),
  scopeUrl("script.js?v=20260804-project12"),
  scopeUrl("site.webmanifest"),
  scopeUrl("assets/icons.css?v=20260804-project12"),
  scopeUrl("assets/fonts/fa-solid-subset.woff2"),
  scopeUrl("assets/fonts/fa-brands-subset.woff2"),
  scopeUrl("hero.webp"),
  scopeUrl("images/logo.webp"),
  scopeUrl("images/pwa-192.png"),
  scopeUrl("images/pwa-512.png"),
  scopeUrl("images/pwa-maskable-192.png"),
  scopeUrl("images/pwa-maskable-512.png")
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(async () => (await caches.match(request)) || caches.match(OFFLINE_PAGE))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const networkRequest = fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached || Response.error());
      return cached || networkRequest;
    })
  );
});
