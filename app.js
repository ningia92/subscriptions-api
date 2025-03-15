import express from 'express'
import 'express-async-errors'
import rateLimit from 'express-rate-limit'
import slowDown from 'express-slow-down'
import connectDB from './database/mongodb.js'
import authRouter from './routes/auth.routes.js'
import userRouter from './routes/users.routes.js'
import subscriptionsRouter from './routes/subscriptions.routes.js'
import errorHandler from './middleware/error-handler.js'
import notFound from './middleware/not-found.js'
import authorize from './middleware/auth.js'

const app = express()
const PORT = process.env.PORT || 5000

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// slow down and rate-limiting mechanisms
app.use(slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 5,
  delayMs: () => 2000
}))
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
}))

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