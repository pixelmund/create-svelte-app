/* eslint-disable no-restricted-globals,@typescript-eslint/no-explicit-any */
import { timestamp, files, shell } from '@sapper/service-worker';

const ASSETS = `cache${timestamp}`;

// `shell` is an array of all the files generated by the bundler,
// `files` is an array of everything in the `static` directory
const toCache = (shell as string[]).concat(files as string[]);
const cached = new Set(toCache);

self.addEventListener(
  'install',
  <EventType extends ExtendableEvent>(event: EventType) => {
    event.waitUntil(
      caches
        .open(ASSETS)
        .then((cache) => cache.addAll(toCache))
        .then(() => {
          ((self as any) as ServiceWorkerGlobalScope).skipWaiting();
        })
    );
  }
);

self.addEventListener(
  'activate',
  <EventType extends ExtendableEvent>(event: EventType) => {
    event.waitUntil(
      caches.keys().then(async (keys) => {
        // delete old caches
        for (const key of keys) {
          // eslint-disable-line no-restricted-syntax
          if (key !== ASSETS) await caches.delete(key); // eslint-disable-line no-await-in-loop
        }

        ((self as any) as { clients: Clients }).clients.claim();
      })
    );
  }
);

self.addEventListener(
  'fetch',
  <EventType extends FetchEvent>(event: EventType) => {
    if (event.request.method !== 'GET' || event.request.headers.has('range'))
      return;

    const url = new URL(event.request.url);

    // don't try to handle e.g. data: URIs
    if (!url.protocol.startsWith('http')) return;

    // ignore dev server requests
    if (
      url.hostname === self.location.hostname &&
      url.port !== self.location.port
    )
      return;

    // always serve static files and bundler-generated assets from cache
    if (url.host === self.location.host && cached.has(url.pathname)) {
      caches.match(event.request).then((match): void => {
        if (match) event.respondWith(match);
      });
      return;
    }

    // for pages, you might want to serve a shell `service-worker-index.html` file,
    // which Sapper has generated for you. It's not right for every
    // app, but if it's right for yours then uncomment this section
    /*
	if (url.origin === self.origin && routes.find(route => route.pattern.test(url.pathname))) {
		event.respondWith(caches.match('/service-worker-index.html'));
		return;
	}
	*/

    if (event.request.cache === 'only-if-cached') return;

    // for everything else, try the network first, falling back to
    // cache if the user is offline. (If the pages never change, you
    // might prefer a cache-first approach to a network-first one.)
    event.respondWith(
      caches.open(`offline${timestamp}`).then(async (cache) => {
        try {
          const response = await fetch(event.request);
          cache.put(event.request, response.clone());
          return response;
        } catch (err) {
          const response = await cache.match(event.request);
          if (response) return response;

          throw err;
        }
      })
    );
  }
);
