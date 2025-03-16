import express from 'express'
import 'express-async-errors'
import connectDB from './database/mongodb.js'
import authRouter from './routes/auth.routes.js'
import userRouter from './routes/users.routes.js'
import subscriptionsRouter from './routes/subscriptions.routes.js'
import errorHandler from './middleware/error-handler.js'
import notFound from './middleware/not-found.js'
import authorize from './middleware/auth.js'
// extra security packages
import rateLimit from 'express-rate-limit'
import slowDown from 'express-slow-down'
import cors from 'cors'
import mongoSanitize from 'express-mongo-sanitize'
import { xss } from 'express-xss-sanitizer'
import helmet from 'helmet'

const app = express()
const PORT = process.env.PORT || 5000

// middlewares to mitigate DoS and brute force attacks: slowDown and rateLimit
// rate limiting that slow down responses rather than blocking them
// use to slow repeated requests to API and/or endpoint
app.use(slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 5, // allow 5 requests per 15 minutes
  delayMs: (hits) => hits * 100 // add 100 ms of delay to every requests after the 5th one
}))
// basic rate-limiting. Use to block repeated requests to public API
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 10, // Limit each IP to 10 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
}))
// parsing user data
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
// data sanitization to cleanse user input and prevent malicious data from reaching application logic
// defend against NoSQL injection
app.use(mongoSanitize())
// middlewares to sanitize user data: xss and mongoSanitize
// sanitize user input data (in req.body, req.query, req.headers and req.params) to prevent XSS attack
app.use(xss())
// help secure app by setting HTTP response headers.
// Headers like Strict-Transport-Security, X-Content-Type-Options, and X-Frame-Options provide an extra layer of protection against various types of attacks.
app.use(helmet())
// enable CORS to allow requests from client residing in different domains
app.use(cors())

// routes
app.get('/', (req, res) => {
  res.send('<h1>Welcome to the Subscriptions Tracker API!</h1>')
})
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', authorize, userRouter)
app.use('/api/v1/subscriptions', authorize, subscriptionsRouter)

// error handler
app.use(notFound)
app.use(errorHandler)

app.listen(PORT, async () => {
  await connectDB()
  console.log(`Subscription Tracker API is running on http://localhost:${PORT}`)
})