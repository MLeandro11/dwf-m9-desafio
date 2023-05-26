import methods from 'micro-method-router'
import type { NextApiRequest, NextApiResponse } from 'next'
import { updateOrderStatus } from 'controllers/order'

module.exports = methods({
    async post(req: NextApiRequest, res: NextApiResponse) {
        const { id, topic } = req.query

        if (topic === 'merchant_order') {
            await updateOrderStatus(id as string)
        }

        res.status(200).send({
            message: 'ok'
        })
    }
})