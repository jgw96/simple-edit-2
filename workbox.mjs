import { injectManifest } from 'workbox-build';

injectManifest({
    globDirectory: 'dist',
    globPatterns: [
      '**/*.{html,json,js,css}',
    ],
    swSrc: 'dist/pwabuilder-sw.js',
    swDest: 'dist/pwabuilder-sw.js',
  });
