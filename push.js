import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getMessaging,
  getToken,
  isSupported,
  onMessage,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js";

const firebaseConfig = {
  apiKey: "AIzaSyDdUb2uIEI0zjcDJ0Yn1tmesrOGIAyUfmY",
  authDomain: "dailybriefing-1f05e.firebaseapp.com",
  projectId: "dailybriefing-1f05e",
  storageBucket: "dailybriefing-1f05e.firebasestorage.app",
  messagingSenderId: "1097242543336",
  appId: "1:1097242543336:web:005f586c6d4b470384b55d",
  measurementId: "G-D2Y717V7PD",
};

const VAPID_PUBLIC_KEY =
  "BJvXpOaeXUsBrCsIQQXJxk55i0riOOCg2QQM3K43ynBkcRYdbjQdfNHvXvo2aoyog9OtHShkKgKpNKLQKq_CXlI";

// const API_BASE_URL = "https://api.inyeshua.com";
const API_BASE_URL = "http://localhost:3000";

const app = initializeApp(firebaseConfig);

async function subscribePush() {
  try {
    const supported = await isSupported();

    if (!supported) {
      alert("이 브라우저는 푸시 알림을 지원하지 않습니다.");
      return;
    }

    if (!("serviceWorker" in navigator)) {
      alert("이 브라우저는 서비스 워커를 지원하지 않습니다.");
      return;
    }

    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      alert("알림 권한이 허용되지 않았습니다.");
      return;
    }

    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js",
    );

    await waitForServiceWorkerActive(registration);

    await navigator.serviceWorker.ready;

    const messaging = getMessaging(app);
    onMessage(messaging, (payload) => {
      console.log("foreground message:", payload);

      new Notification(
        payload.notification?.title || "오늘의 기독교 뉴스 브리핑",
        {
          body: payload.notification?.body || "브리핑이 업데이트되었습니다.",
          icon: "./favicon.png",
        },
      );
    });

    const token = await getToken(messaging, {
      vapidKey: VAPID_PUBLIC_KEY,
      serviceWorkerRegistration: registration,
    });

    if (!token) {
      alert("알림 토큰을 발급받지 못했습니다.");
      return;
    }

    await fetch(`${API_BASE_URL}/dailyBriefing/push/subscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        userAgent: navigator.userAgent,
        subscribedAt: new Date().toISOString(),
      }),
    });

    alert("브리핑 알림이 등록되었습니다.");
  } catch (error) {
    console.error("push subscribe error:", error);
    alert("알림 등록 중 오류가 발생했습니다.");
  }
}

async function waitForServiceWorkerActive(registration) {
  if (registration.active) {
    return registration;
  }

  const serviceWorker = registration.installing || registration.waiting;

  if (!serviceWorker) {
    await navigator.serviceWorker.ready;
    return registration;
  }

  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error("Service worker activation timeout"));
    }, 10000);

    serviceWorker.addEventListener("statechange", () => {
      if (serviceWorker.state === "activated") {
        clearTimeout(timeout);
        resolve();
      }
    });
  });

  return registration;
}

window.subscribePush = subscribePush;
