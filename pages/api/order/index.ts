import { authMiddleware, schemaQueryMiddleware } from 'lib/middlewares'
import methods from 'micro-method-router'
import { createOrder } from 'controllers/order'
import type { NextApiRequest, NextApiResponse } from 'next'
import { object, string } from "yup"

let querySchema = object({
    productId: string().required()
}).strict()
    .noUnknown(true)

async function postHandler(req: NextApiRequest, res: NextApiResponse, token) {
    const userId = token.userId
    const productId = req.query.productId as string
    const dataAditionalOrder = req.body

    try {
        const order = await createOrder(userId, productId, dataAditionalOrder)
        res.status(200).send(order)
    } catch (e) {
        res.status(500).send({
            message: e,
            ok: false
        })
    }
}
const handler = methods({
    post: authMiddleware(postHandler)
})

export default schemaQueryMiddleware(querySchema, handler)