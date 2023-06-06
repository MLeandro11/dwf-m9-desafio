import methods from 'micro-method-router'
import type { NextApiRequest, NextApiResponse } from 'next'
import { authMiddleware } from 'lib/middlewares'
import { updateUser } from 'controllers/users'


const handler = methods({
    async patch(req: NextApiRequest, res: NextApiResponse, token) {
        if (req.body.email) {
            res.status(400).send({
                ok: false,
                message: 'no puedes cambiar tu email'
            })
        }

        await updateUser(token.userId, req.body)
        res.status(200).send({
            ok: true,
            message: 'user updated'
        })
    }
})

export default authMiddleware(handler)