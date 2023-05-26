import { Auth } from "models/auth";
import { User } from "models/user";
import gen from 'random-seed'
import { addMinutes } from "date-fns"
import { sendEmail } from "lib/sendgrid";
import { genereateToken } from "lib/jwt";


const seed = '123456789'
const random = gen.create(seed)

export async function findOrCreateAuth(email: string): Promise<Auth> {
    const clearEmail = email.trim().toLowerCase()
    const auth = await Auth.findByEmail(clearEmail)
    if (auth) {
        return auth
    } else {
        const newUser = await User.createNewUser({
            email: clearEmail
        })
        const newAuth = await Auth.createNewAuth({
            userId: newUser.id,
            email: clearEmail,
            code: '',
            expires: ''
        })
        return newAuth
    }
}

export async function sendCode(email) {
    const auth = await findOrCreateAuth(email)

    const code = random.intBetween(10000, 99999)
    const now = new Date()
    const twentyMinutesFromNow = addMinutes(now, 20)

    auth.data.code = code
    auth.data.expires = twentyMinutesFromNow

    await auth.push()
    console.log('code to send', code)
    await sendEmail({
        to: email,
        from: process.env.EMAIL_FROM,
        subject: "Verify your email",
        text: 'Your verification code is ' + code,
        html: `
            <p>Your verification code is ${code}</p>
        `
    })

    return auth
}
export async function sendToken(email: string, code: number) {
    const auth = await Auth.findByEmailAndCode(email, code)
    if (!auth) throw 'email or code invalid'
    const expired = auth.isCodeExpired()
    if (expired) throw 'code expired'

    const token = genereateToken({ userId: auth.data.userId })

    return token
}