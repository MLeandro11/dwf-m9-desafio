import type { NextApiRequest, NextApiResponse } from 'next'
import { decodeToken } from "lib/jwt"
import parseToken from 'parse-bearer-token'


export function authMiddleware(callback) {
    return function (req: NextApiRequest, res: NextApiResponse) {
        const token = parseToken(req)
        if (!token) {
            res.status(401).send({
                message: 'not token'
            })
        }
        const decodedtoken = decodeToken(token)
        if (decodedtoken) {
            callback(req, res, decodedtoken)
        } else {
            res.status(401).send({
                message: 'token invalid'
            })
        }
    }
}

export function schemaQueryMiddleware(schema, callback) {
    return async function (req: NextApiRequest, res: NextApiResponse) {
        try {
            await schema.validate(req.query)
            callback(req, res)
        } catch (e) {
            res.status(422).send({
                field: 'query',
                message: e
            })
        }
    }
}
export function schemaBodyMiddleware(schema, callback) {
    return async function (req: NextApiRequest, res: NextApiResponse) {
        try {
            await schema.validate(req.body)
            callback(req, res)
        } catch (e) {
            res.status(422).send({
                field: 'body',
                message: e
            })
        }
    }
}

