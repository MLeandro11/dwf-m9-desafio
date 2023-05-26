import { firestore } from "lib/firestore";

const collection = firestore.collection('users')

export class User {
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
    static async createNewUser(data) {
        const newUserSnap = await collection.add(data)
        const newUser = new User(newUserSnap.id)
        newUser.data = data
        return newUser
    }
    static async getById(id: string) {
        const user = new User(id)
        await user.pull()
        return user
    }
}