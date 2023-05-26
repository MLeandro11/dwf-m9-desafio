import { Order } from "models/order"
import { User } from "models/user"

export async function getUserById(userId: string) {
    const user = User.getById(userId)
    return user
}
export async function updateUser(userId: string, data: any) {
    const user = await getUserById(userId)

    user.data = data
    await user.push()

    return user
}
export async function getAllUserOrders(userId: string) {
    const orders = await Order.findOrdersByUser(userId)
    return orders
}