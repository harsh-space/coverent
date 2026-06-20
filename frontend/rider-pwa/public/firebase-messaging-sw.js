// Scripts for firebase and firebase messaging
// We need to import the compat version of Firebase for Service Workers
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js');

// PLACEHOLDER: Replace these with your actual Firebase project config from the Firebase Console
firebase.initializeApp({
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
});

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  // Customize notification here
  const notificationTitle = payload.notification.title || "Coverent Payout Settled!";
  const notificationOptions = {
    body: payload.notification.body || "A new payout has been added to your account.",
    icon: '/vite.svg', // Replace with your actual PWA icon
    badge: '/vite.svg', // Icon for Android notification bar
    vibrate: [200, 100, 200, 100, 200], // Distinctive vibration pattern
    tag: 'coverent-payout' // Prevents duplicate notifications
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
