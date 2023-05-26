import admin from 'firebase-admin';

const seerviceAccount = JSON.parse(process.env.FIREBASE_CONNECTION)
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(seerviceAccount)
    })
}

const firestore = admin.firestore()

export { firestore }