const workboxBuild = require('workbox-build');


  return workboxBuild.generateSW({
    globDirectory: 'dist',
    globPatterns: [
      '**/*.{html,json,js,css}',
    ],
    swDest: 'dist/pwabuilder-sw.js',
  });
