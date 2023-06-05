import methods from 'micro-method-router'
import type { NextApiRequest, NextApiResponse } from 'next'
import { updateOrderStatus } from 'controllers/order'
import { handlerCORS } from 'lib/middlewares'

async function handlerWebhook(req: NextApiRequest, res: NextApiResponse) {
    const { id, topic } = req.query

    if (topic === 'merchant_order') {
        await updateOrderStatus(id as string)
    }

    res.status(200).send({
        message: 'ok'
    })
}
const handler = methods({
    POST: handlerWebhook
})

export default handlerCORS(handler);