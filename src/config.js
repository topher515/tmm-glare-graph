
require('dotenv').config({ path: '.env', silent: false })

export const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATA_URL,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
}

export const firebaseServiceConfig = {
  serviceAccount: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY
  },
  databaseURL: process.env.FIREBASE_DATA_URL
}
