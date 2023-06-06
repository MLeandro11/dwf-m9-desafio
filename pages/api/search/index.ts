import methods from 'micro-method-router'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getOffsetAndLimitFromReq } from 'lib/requests'
import { searchProducts } from 'controllers/products'

async function handlerSearch(req: NextApiRequest, res: NextApiResponse) {
    const { limit, offset } = getOffsetAndLimitFromReq(req)
    const q = req.query.q as string

    const products = await searchProducts(q, limit, offset)

    res.status(200).json({
        results: products.hits,
        pagination: {
            total: products.nbHits,
            limit,
            offset
        }

    })

}
const handler = methods({
    get: handlerSearch
})
export default handler