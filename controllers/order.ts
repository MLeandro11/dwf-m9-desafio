import { Order, OrderData } from 'models/order'
import { createPreference, getMerchantOrder } from 'lib/mercadopago'
import { getProductById } from 'controllers/products'
import { getUserById } from './users'
import { sendEmail } from 'lib/sendgrid'

export async function createOrder(userId: string, productId: string, additionalInfo) {
    const product = await getProductById(productId)
    if (!product) throw 'Product not found'

    const order = await Order.createNewOrder({
        userId,
        product: {
            id: productId,
            name: product.name,
            description: product.description,
            price: product.unit_cost,
            image: product.images[0].url
        },
        status: 'pending',
        createdAt: new Date(),
        additionalInfo
    })
    const preference = {
        payer: {
            name: additionalInfo.name,
            surname: additionalInfo.surname,
            email: additionalInfo.email
        },

        items: [
            {
                id: product.objectID,
                title: product.name,
                // description: product["description"],
                picture_url: product.images[0].url,
                category_id: product.type,
                quantity: 1,
                currency_id: "ARS",
                unit_price: product.unit_cost
            }
        ],
        back_urls: {
            success: process.env.PAGE_SUCCESS,//---> url de pagina si todo saldría bien
            pending: '',//---> url de pagina donde mostraría que el pago esta pendiente
            failure: ''//---> url de pagina donde mostraría que el pago fallo
        },
        external_reference: order.id,
        notification_url: process.env.URL_WEB_HOOKS,//---> aca va la url de la api deployada
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
    try {
        const orderMp = await getMerchantOrder(mpId)
        const orderId = orderMp.external_reference
        const orderDb = await getOrderById(orderId)
        console.log(orderMp);

        if (orderMp.order_status === "payment_required") {
            orderDb.data.status = 'payment_required'
            orderDb.data.externalOrder = orderMp
            await orderDb.push()
        }

        if (orderMp.order_status === 'paid') {

            orderDb.data.status = 'paid'
            orderDb.data.externalOrder = orderMp
            await orderDb.push()

            await sendEmailToBuyer(orderDb.data)
        }

    } catch (error) {
        console.log("error del catch", error);
    }
    return true

}

async function sendEmailToBuyer(order: OrderData) {
    const buyer = await getUserById(order.userId)
    const { name, description, price } = order.product
    return await sendEmail({
        to: buyer.data.email,
        from: process.env.EMAIL_FROM,
        subject: 'Gracias por tu compra',
        html: `
                <h1>Gracias por tu compra</h1>
                <p>Tu pedido ha sido pagado con éxito</p>
                <strong>Detalles del pedido</strong>
                <ul>
                    <li>Nombre: ${name}</li>
                    <li>Descripción: ${description}</li>
                    <li>Precio: ${price}</li>
                </ul>
            `,
    })
}