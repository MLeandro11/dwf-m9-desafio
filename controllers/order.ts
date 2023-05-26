import { Order, OrderData } from 'models/order'
import { createPreference, getMerchantOrder } from 'lib/mercadopago'
import { getProductById } from 'controllers/products'
import { getUserById } from './users'
import { sendEmail } from 'lib/sendgrid'

export async function createOrder(userId: string, productId: string, aditionalInfo) {
    const product = await getProductById(productId)
    if (!product) throw 'Product not found'

    const order = await Order.createNewOrder({
        userId,
        product: {
            id: productId,
            name: product["name"],
            description: product['description'],
            price: product["unit_cost"]
        },
        status: 'pending',
        createdAt: new Date(),
        aditionalInfo
    })
    const preference = {
        items: [
            {
                id: productId,
                title: product["name"],
                // description: product["description"],
                picture_url: product["images"][0].url,
                category_id: product["type"],
                quantity: 1,
                currency_id: "ARS",
                unit_price: product["unit_cost"]
            }
        ],
        back_urls: {
            success: '',//---> url de pagina si todo saldria bien
            pending: '',//---> url de pagina donde mostraria que el pago esta pendiente
            failure: ''//---> url de pagina donde mostraria que el pago fallo
        },
        external_reference: order.id,
        notification_url: 'https://webhook.site/9efd9f05-bc02-43d2-b462-e920288ffa1b',//---> aca va la url de la api deployada
    }
    try {
        const newPreference = await createPreference(preference)
        return {
            url: newPreference.init_point,
            orderId: order.id
        }

    } catch (error) {
        console.log(error);
        throw "Error al crear la preferencia"
    }
}

export async function getOrderById(orderId: string) {
    const order = await Order.getById(orderId)
    if (!order.data) return null
    return order
}

export async function updateOrderStatus(mpId: String) {
    const orderMp = await getMerchantOrder(mpId)

    if (orderMp.order_status === 'paid') {
        const orderId = orderMp.external_reference
        const orderDb = await getOrderById(orderId)

        orderDb.data.status = 'paid'
        orderDb.data.externalOrder = orderMp
        await orderDb.push()

        await sendEmailToBuyer(orderDb.data)
    }
    return true
}

async function sendEmailToBuyer(order: OrderData) {
    const buyer = await getUserById(order.userId)
    const product = order.product
    return await sendEmail({
        to: buyer.data.email,
        from: process.env.EMAIL_FROM,
        subject: 'Gracias por tu compra',
        html: `
                <h1>Gracias por tu compra</h1>
                <p>Tu pedido ha sido pagado con éxito</p>
                <strong>Detalles del pedido</strong>
                <ul>
                    <li>Nombre: ${product.name}</li>
                    <li>Descripcion: ${product.description}</li>
                    <li>Precio: ${product.price}</li>
                </ul>
            `,
    })
}