import { initializeApp } from 'firebase/app'
// import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
// import "firebase/compat/database";

const deployedOnTestServer = process.env.REACT_APP_DEV_DEPLOYMENT;

const prodConfig = {
  // see https://console.cloud.google.com/apis/credentials?project=cioos-metadata-form
  // and https://console.cloud.google.com/apis/credentials?project=cioos-metadata-form-dev
  // for api key location which is then stored in a github secret and added to several
  // github actions to support testing and deployment.
  // see https://firebase.google.com/docs/projects/api-keys for a discussion of why we 
  // don't need to restrict api keys for firebase but might in some situations.
  // To prevent the future foot gun, we are restricting the key now.
  apiKey: process.env.REACT_APP_GOOGLE_CLOUD_API_KEY,
  authDomain: "cioos-metadata-form.firebaseapp.com",
  databaseURL: "https://cioos-metadata-form.firebaseio.com",
  projectId: "cioos-metadata-form",
  storageBucket: "cioos-metadata-form.appspot.com",
  messagingSenderId: "646114203434",
  appId: "1:646114203434:web:bccceadc5144270f98f053",
};

const devConfig = {
  apiKey: process.env.REACT_APP_GOOGLE_CLOUD_API_KEY_DEV,
  authDomain: "cioos-metadata-form-dev.firebaseapp.com",
  databaseURL: "https://cioos-metadata-form-dev-default-rtdb.firebaseio.com/",
  projectId: "cioos-metadata-form-dev",
  storageBucket: "cioos-metadata-form-dev.appspot.com",
  messagingSenderId: "392401521083",
  appId: "1:392401521083:web:45d1539f9d284f446d5c9e",
};


const config = process.env.NODE_ENV === "production" && !deployedOnTestServer
  ? prodConfig
  : devConfig

if (window.location.hostname === "localhost" && deployedOnTestServer) {
  config.databaseURL = "http://localhost:9001?ns=cioos-metadata-form"
}

const App = initializeApp(config);

// // uncomment below to use firebase emulator for local development
// if (window.location.hostname === "localhost" && deployedOnTestServer) {
//   const functions = getFunctions(App);
//   connectFunctionsEmulator(functions, "127.0.0.1", 5001);
//   connectFunctionsEmulator(functions, "127.0.0.1", 5002);
// }


export default App;

