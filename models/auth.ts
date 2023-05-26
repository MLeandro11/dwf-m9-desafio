import { firestore } from "lib/firestore";
import { isAfter } from "date-fns"

const collection = firestore.collection('auth')

export class Auth {
    id: string;
    ref: FirebaseFirestore.DocumentReference
    data: any
    constructor(id: string) {
        this.id = id
        this.ref = collection.doc(id)
    }
    async pull() {
        const snap = await this.ref.get()
        this.data = snap.data()
    }
    async push() {
        await this.ref.update(this.data)
    }

    isCodeExpired() {
        const now = new Date();
        const expires = this.data.expires.toDate()
        return isAfter(now, expires)
    }

    static async findByEmail(email: string) {
        const clearEmail = email.trim().toLowerCase()
        const results = await collection.where('email', '==', clearEmail).get()
        if (results.size > 0) {
            const first = results.docs[0]
            const newAuth = new Auth(first.id)
            newAuth.data = first.data()
            return newAuth
        }
        return null
    }

    static async createNewAuth(data) {
        const newAuthSnap = await collection.add(data)
        const newAuth = new Auth(newAuthSnap.id)
        newAuth.data = data
        return newAuth
    }

    static async findByEmailAndCode(email: string, code: number) {
        const result = await collection.where('email', '==', email).where('code', '==', code).get()
        if (result.empty) {
            console.error('email y code no coinciden')
            return null
        }
        const first = result.docs[0]
        const auth = new Auth(first.id)
        auth.data = first.data()
        return auth
    }

}