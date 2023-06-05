import methods from 'micro-method-router'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getProductById } from 'controllers/products'
import { handlerCORS, schemaQueryMiddleware } from 'lib/middlewares'
import { object, string } from "yup"

let querySchema = object({
    id: string().required()
})
async function getHandler(req: NextApiRequest, res: NextApiResponse) {
    const id = req.query.id as string

    try {
        const product = await getProductById(id)
        res.status(200).send({
            ok: true,
            product
        })

    } catch (error) {
        res.status(500).send({
            ok: false,
            message: 'product not found'
        })
    }
}

const handler = methods({
    get: getHandler
})

export default handlerCORS(schemaQueryMiddleware(querySchema, handler))