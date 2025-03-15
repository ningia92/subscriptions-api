import { Router } from 'express'
import { getUsers, getUser, createUser, updateUser, deleteUser } from '../controllers/users.controller.js'
const userRouter = Router()

// path: /api/v1/users
userRouter.get('/', getUsers)
userRouter.get('/:id', getUser)
userRouter.post('/', createUser)
userRouter.patch('/:id', updateUser)
userRouter.delete('/:id', deleteUser)

export default userRouter