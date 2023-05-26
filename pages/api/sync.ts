import methods from 'micro-method-router'
import type { NextApiRequest, NextApiResponse } from 'next'
import { syncProductsInDatabase } from 'controllers/products'

module.exports = methods({
    async get(req: NextApiRequest, res: NextApiResponse) {
        try {
            await syncProductsInDatabase()
            res.status(200).json({
                ok: true,
                message: 'sync completed',
            })

        } catch (error) {
            res.status(500).send({
                message: error,
                ok: false
            })
        }

    }
})