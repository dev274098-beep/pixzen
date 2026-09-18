import {
  initializeApp,
  getApps,
  getApp,
} from "firebase/app";

import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAoKiw2RZAKDHasCgvSekX3z3jWkNR-Gs8",
  authDomain: "pixzen-1b03b.firebaseapp.com",
  projectId: "pixzen-1b03b",
  storageBucket: "pixzen-1b03b.firebasestorage.app",
  messagingSenderId: "757775376648",
  appId: "1:757775376648:web:c2b23946fd3169aa3a8cbd",
  measurementId: "G-BPVEPSBJYE",
};

const app =
  getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig);

export const auth = getAuth(app);

/*
  IMPORTANT:
  Keep Firebase login after browser refresh.
*/
export const authPersistence =
  setPersistence(
    auth,
    browserLocalPersistence
  ).catch((error) => {
    console.error(
      "[PIXZEN] Auth persistence error:",
      error
    );
  });

export default app;