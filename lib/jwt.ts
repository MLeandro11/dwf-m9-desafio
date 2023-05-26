import jwt from "jsonwebtoken"

export const SECRET = process.env.JWT_SECRET;

export function genereateToken(data) {
    return jwt.sign(data, SECRET);
}

export function decodeToken(token) {
    try {
        return jwt.verify(token, SECRET);
    } catch (error) {
        console.error('token invalid');
        return null;
    }
}