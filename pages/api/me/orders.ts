import methods from 'micro-method-router'
import type { NextApiRequest, NextApiResponse } from 'next'
import { authMiddleware, handlerCORS } from 'lib/middlewares'
import { getAllUserOrders } from 'controllers/users'

const handler = methods({
    async get(req: NextApiRequest, res: NextApiResponse, token) {
        const userId = token.userId
        const orders = await getAllUserOrders(userId)
        res.status(200).send({
            ok: true,
            orders
        })
    }
})

export default handlerCORS(authMiddleware(handler))