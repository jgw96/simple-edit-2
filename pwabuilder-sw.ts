import { precacheAndRoute } from "workbox-precaching";
import {registerRoute} from 'workbox-routing';
import { CacheFirst } from "workbox-strategies";

// Add custom service worker logic, such as a push notification serivce, or json request cache.
self.addEventListener("message", (event: any) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
     self.skipWaiting();
  }
});

async function shareTargetHandler(event: any) {
  event.respondWith(Response.redirect("/"));

  return event.waitUntil(async function () {

    const data = await event.request.formData();
    console.log('data', data);
    const client = await self.clients.get(event.resultingClientId || event.clientId);
    // Get the data from the named element 'file'
    const file = data.get('file');

    console.log('file', file);
    client.postMessage({ file, action: 'load-image' });
  }());
};

registerRoute(
  '/share/image/',
  shareTargetHandler,
  'POST'
);

registerRoute(
  ({ url }) => url.href.includes("shoelace"),
  new CacheFirst()
);

registerRoute(
  ({ url }) => url.href.includes("ionic"),
  new CacheFirst()
);

registerRoute(
  ({ url }) => url.href.includes("@pwabuilder"),
  new CacheFirst()
);


try {
  //@ts-ignore
  precacheAndRoute(self.__WB_MANIFEST);
}
catch (err) {
  console.info("if you are in development mode this error is expected: ", err);
}


