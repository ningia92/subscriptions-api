import User from '../models/user.model.js'

// @desc   Sign up user
// @route  POST /api/v1/auth/sign-up
export const signUp = async (req, res) => {
  const { name, email, password, adminSecret } = req.body

  // check if a user already exist
  const existingUser = await User.findOne({ email: email })
  if (existingUser) throw Object.assign(new Error('User already exists'), { statusCode: 400 })

  // check if the user have admin secret
  const isAdmin = (adminSecret === process.env.ADMIN_SECRET)
  const role = isAdmin ? 'admin' : User.schema.path('role').getDefault()

  const user = await User.create({ name, email, password, role })
  const token = user.createJWT()

  res.status(201).json({ message: 'User signed up successfully', user: { name: user.name, token: token } })
}

// @desc   Sign in user
// @route  POST /api/v1/auth/sign-in
export const signIn = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) throw Object.assign(new Error('Please provide email and password'), { statusCode: 400 })

  const user = await User.findOne({ email })
  if (!user) throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 })

  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 })

  const token = user.createJWT()

  res.status(200).json({ message: 'User signed in successfully', user: { name: user.name, token: token } })
}