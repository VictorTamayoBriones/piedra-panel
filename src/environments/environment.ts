// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  firebase: {
    projectId: 'la-plazuela-eae43',
    appId: '1:549492199614:web:76b7aba3d282db40198eef',
    storageBucket: 'la-plazuela-eae43.appspot.com',
    apiKey: 'AIzaSyAt7xPeJO_ad9KhYNkY2xMztZvmZYl4pCc',
    authDomain: 'la-plazuela-eae43.firebaseapp.com',
    messagingSenderId: '549492199614',
  },
  production: false,
  //URL_API: 'http://localhost:8080/api',
  URL_API: 'https://piedra-mongo-back-production.up.railway.app/api',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
