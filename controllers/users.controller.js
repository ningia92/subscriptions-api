import User from '../models/user.model.js'

// @desc   Get all users
// @route  GET /api/v1/users/
export const getUsers = async (req, res) => {
  if (req.user.role !== 'admin') throw Object.assign(new Error('Forbidden resource'), { statusCode: 403 })

  const users = await User.find()

  if (users.length === 0) return res.status(200).json({ message: 'There are no users' })

  res.status(200).json({ users })
}

// @desc   Get user
// @route  GET /api/v1/users/:id
export const getUser = async (req, res) => {
  const id = req.params.id
  const user = await User.findById(id).select('-password')

  // check if the user who want to get the user data is not the same user
  // and if the user is not admin
  if (req.user.id !== id && req.user.role !== 'admin') {
    throw Object.assign(new Error('Forbidden resource'), { statusCode: 403 })
  }

  if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 })

  res.status(200).json({ user })
}

// @desc   Create user
// @route  POST /api/v1/users/
export const createUser = async (req, res) => {
  if (req.user.role !== 'admin') throw Object.assign(new Error('Forbidden resource'), { StatusCode: 403 })

  const { name, email, password } = req.body

  const user = await User.create({ name, email, password })

  res.status(201).json(user)
}

// @desc   Update user
// @route  PATCH /api/v1/users/:id
export const updateUser = async (req, res) => {
  const { name, email, password } = req.body
  const id = req.params.id

  // check if the user who want to update the user data is not the same user
  // and if the user is not admin
  if (req.user.id !== id && req.user.role !== 'admin') {
    throw Object.assign(new Error('Forbidden resource'), { statusCode: 403 })
  }

  if (!name && !email && !password) {
    throw Object.assign(new Error('Fields cannot be empty'), { statusCode: 400 })
  }

  const user = await User.findByIdAndUpdate(id, { $set: req.body }, { new: true, runValidators: true })

  if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 })

  res.status(204).end()
}

// @desc   Delete users
// @route  DELETE /api/v1/users/:id
export const deleteUser = async (req, res) => {
  const id = req.params.id

  // check if the user who want to delete the user data is not the same user
  // and if the user is not admin
  if (req.user.id !== id && req.user.role !== 'admin') {
    throw Object.assign(new Error('Forbidden resource'), { statusCode: 403 })
  }

  const user = await User.findByIdAndDelete(id)

  if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 })

  res.status(204).end()
} 