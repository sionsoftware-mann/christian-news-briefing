importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js",
);

importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyDdUb2uIEI0zjcDJ0Yn1tmesrOGIAyUfmY",
  authDomain: "dailybriefing-1f05e.firebaseapp.com",
  projectId: "dailybriefing-1f05e",
  messagingSenderId: "1097242543336",
  appId: "1:1097242543336:web:005f586c6d4b470384b55d",
});

const messaging = firebase.messaging();
