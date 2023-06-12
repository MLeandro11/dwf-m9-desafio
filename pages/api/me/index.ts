import methods from 'micro-method-router'
import type { NextApiRequest, NextApiResponse } from 'next'
import { authMiddleware } from 'lib/middlewares'
import { getUserById, updateUser } from 'controllers/users'


async function getHandler(req: NextApiRequest, res: NextApiResponse, token) {
    try {
        const user = await getUserById(token.userId)
        res.status(200).send(user.data)
    } catch (error) {
        res.status(500).send(error)
    }
}
async function patchHandler(req: NextApiRequest, res: NextApiResponse, token) {
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

const handler = methods({
    get: getHandler,
    patch: patchHandler
})

export default authMiddleware(handler)
