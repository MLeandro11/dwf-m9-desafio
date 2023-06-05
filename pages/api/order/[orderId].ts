import methods from 'micro-method-router'
import { getOrderById } from 'controllers/order'
import type { NextApiRequest, NextApiResponse } from 'next'
import { handlerCORS, schemaQueryMiddleware } from 'lib/middlewares'
import { object, string } from "yup"

let querySchema = object({
    orderId: string().required()
})
async function getHandler(req: NextApiRequest, res: NextApiResponse) {
    const orderId = req.query.orderId as string
    const order = await getOrderById(orderId)

    if (!order) return res.status(404).send({
        message: 'Order not found',
        ok: false
    })
    res.status(200).send({
        ok: true,
        order: order.data
    })
}
const handler = methods({
    get: getHandler
})
export default handlerCORS(schemaQueryMiddleware(querySchema, handler))