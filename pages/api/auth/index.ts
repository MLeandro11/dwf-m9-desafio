import methods from 'micro-method-router'
import type { NextApiRequest, NextApiResponse } from 'next'
import { sendCode } from "controllers/auth";
import { schemaBodyMiddleware } from 'lib/middlewares'
import { object, string } from "yup"

let bodySchema = object({
    email: string().email().required()
}).strict()
    .noUnknown(true)

const handler = methods({
    async post(req: NextApiRequest, res: NextApiResponse) {
        const email = req.body.email
        const auth = await sendCode(email)

        res.status(200).send({
            message: 'ok',
        })
    }
})

export default schemaBodyMiddleware(bodySchema, handler)