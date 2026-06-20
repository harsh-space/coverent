import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// PLACEHOLDER: Replace these with your actual Firebase project config from the Firebase Console
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);

let messaging = null;

// Initialize Messaging only if supported in the browser
if (typeof window !== "undefined" && "Notification" in window) {
  messaging = getMessaging(app);
}

export const requestForToken = async () => {
  if (!messaging) return null;
  
  try {
    const currentToken = await getToken(messaging, { 
      // VAPID key is required to generate a push subscription.
      // Replace with your VAPID key from Firebase Console -> Project Settings -> Cloud Messaging -> Web configuration
      vapidKey: 'YOUR_VAPID_KEY_HERE' 
    });
    
    if (currentToken) {
      console.log('FCM Token generated successfully');
      return currentToken;
    } else {
      console.log('No registration token available. Request permission to generate one.');
      return null;
    }
  } catch (err) {
    console.log('An error occurred while retrieving token. ', err);
    return null;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    if (!messaging) return;
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

export { messaging };
