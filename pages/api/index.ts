import methods from 'micro-method-router'
import type { NextApiRequest, NextApiResponse } from 'next'

module.exports = methods({
    async get(req: NextApiRequest, res: NextApiResponse) {
        res.status(200).send({
            message: 'Api dwf-m9-desafio!'
        })
    }
})