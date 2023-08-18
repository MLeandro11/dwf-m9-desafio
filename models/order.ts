import { firestore } from "lib/firestore";

export interface OrderData {
    userId: string;
    product: {
        id: string;
        name: string;
        description: string;
        price: number;
        image: string
    };
    status: string;
    createdAt: Date;
    additionalInfo: any;
    externalOrder?: any;
}

const collection = firestore.collection('orders')

export class Order {
    id: string;
    ref: FirebaseFirestore.DocumentReference
    data: OrderData
    constructor(id: string) {
        this.id = id
        this.ref = collection.doc(id)
    }
    async pull() {
        const snap = await this.ref.get()
        this.data = snap.data() as OrderData
    }
    async push() {
        await this.ref.update(this.data as any)
    }
    static async createNewOrder(data: OrderData) {
        const newOrderSnap = await collection.add(data)
        const newOrder = new Order(newOrderSnap.id)
        newOrder.data = data

        return newOrder
    }
    static async findOrdersByUser(userId: string) {
        const snapOrders = await collection.where('userId', '==', userId).get()
        if (snapOrders.empty) return []
        let orders = []
        snapOrders.forEach(order => {
            orders.push({
                ...order.data(),
                id: order.id
            })
        })
        return orders
    }

    static async getById(orderId: string) {
        const order = new Order(orderId)
        await order.pull()
        return order
    }
}