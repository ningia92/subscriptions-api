import { Router } from 'express'
import { signUp, signIn } from '../controllers/auth.controller.js'
const authRouter = Router()

// path: /api/v1/auth
authRouter.post('/sign-up', signUp)
authRouter.post('/sign-in', signIn)

export default authRouter

