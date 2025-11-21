// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// export const environment = {
//   production: true,
//   enableDebug: false 
// };

export const environment = {
  production: true,
  apiKey:'',
  // baseUrl: 'https://ekarigartech.com',
  // apiBaseUrl: 'https://ekarigartech.com/sony-erp',
    baseUrl: 'https://diamondraja.com',
  apiBaseUrl: 'https://diamondraja.com/sony-erp-staging',
  images: '',
  appVersion: 'v2.0.1',
  enableDebug: false,
  firebaseConfig: {
    apiKey: 'AIzaSyAd7pXqyw__LYrNcUsnrQ1iBYuZOhac3FY',//done 
    authDomain: 'pta-happy-2764d.firebaseapp.com',//done
    projectId: 'pta-happy-2764d',//done 
    storageBucket: 'pta-happy-2764d.firebasestorage.app',//done 
    messagingSenderId: '677352026802',//
    appId: '1:677352026802:android:d07b938d95db26ed014fab'//done
  }
};

// export const environment = {
//   production: false,
//   firebaseConfig: {
//     apiKey: 'AIzaSyASpWr5ShY5O91YjiT7ruOl67JpnF89KRk',
//     authDomain: 'get-glow-62cbc.firebaseapp.com',
//     projectId: 'get-glow-62cbc',
//     storageBucket: 'get-glow-62cbc.appspot.com',
//     messagingSenderId: '1025126006775',
//     appId: '1:1025126006775:android:aafb58fe459037d935f8f2'
//   }
// };

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
