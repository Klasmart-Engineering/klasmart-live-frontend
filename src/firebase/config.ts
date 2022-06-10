import {
    Analytics,
    getAnalytics,
    logEvent,
} from "firebase/analytics";
import {
    getApps,
    initializeApp,
} from 'firebase/app';
import {
    FirebasePerformance,
    getPerformance,
} from "firebase/performance";

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

export let analytics: Analytics | undefined;
export let performance: FirebasePerformance | undefined;

export const initializeFirebase = () => {
    if (!process.env.FIREBASE_API_KEY) return;
    if (getApps().length) return;

    const app = initializeApp(firebaseConfig);
    analytics = getAnalytics(app);
    performance = getPerformance(app);
};

export const updatePageEvent = () => {
    if (!analytics) return;
    const pathName = `${location.host}${location.pathname}${location.hash}`;
    logEvent(analytics, `screen_view`, {
        firebase_screen: pathName,
        firebase_screen_class: `router`,
    });
};
