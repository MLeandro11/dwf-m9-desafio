import methods from 'micro-method-router'
import type { NextApiRequest, NextApiResponse } from 'next'
import { updateOrderStatus } from 'controllers/order'


async function handlerWebhook(req: NextApiRequest, res: NextApiResponse) {
    const { id, topic } = req.query
    console.log(id, topic);

    if (topic === 'merchant_order') {
        await updateOrderStatus(id as string)
    }

    res.status(200).send({
        message: 'ok'
    })
}
const handler = methods({
    post: handlerWebhook
})

export default handler