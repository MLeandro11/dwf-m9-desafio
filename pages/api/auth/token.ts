import methods from 'micro-method-router'
import type { NextApiRequest, NextApiResponse } from 'next'
import { sendToken } from 'controllers/auth';
import { schemaBodyMiddleware } from 'lib/middlewares'
import { object, string, number } from "yup"

let bodySchema = object({
    email: string().email().required(),
    code: number().required()
}).strict()
    .noUnknown(true)

const handler = methods({
    async post(req: NextApiRequest, res: NextApiResponse) {
        const { email, code } = req.body
        try {
            const token = await sendToken(email, code)
            res.status(200).send({
                token
            })
        } catch (error) {
            res.status(400).send({
                ok: false,
                message: error
            })
        }
    }
})

export default schemaBodyMiddleware(bodySchema, handler)