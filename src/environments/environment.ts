// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyAyj0aWqHrFtAQsXjZXKfy9EmSVtCT5kp0',
    authDomain: 'zach-medium.firebaseapp.com',
    databaseURL: 'https://zach-medium.firebaseio.com',
    projectId: 'zach-medium',
    storageBucket: 'zach-medium.appspot.com',
    messagingSenderId: '259255812527',
    appId: '1:259255812527:web:67abe9ce18e7c508'
  }
};
