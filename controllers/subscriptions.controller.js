import Subscription from '../models/subscription.model.js'
import User from '../models/user.model.js'

// @desc   Get all subscriptions (admin)
// @route  GET /api/v1/subscriptions
export const getSubscriptions = async (req, res) => {
  if (req.user.role !== 'admin') throw Object.assign(new Error('Forbidden resource'), { statusCode: 403 })

  const subscriptions = await Subscription.find()

  if (subscriptions.length === 0) return res.status(200).json({ message: 'There are zero subscriptions' })

  res.status(200).json(subscriptions)
}

// @desc   Get subscription (user/admin)
// @route  GET /api/v1/subscription/:id
export const getSubscription = async (req, res) => {
  const id = req.params.id
  const subscription = await Subscription.findById(id)

  // check if the user who want to get the sub is not the same that who created it
  // and if the user is not admin
  if (req.user.id !== subscription.user && req.user.role !== 'admin') {
    throw Object.assign(new Error('Forbidden resource'), { statusCode: 403 })
  }

  if (!subscription) throw Object.assign(new Error('Subscription not found'), { statusCode: 404 })

  res.status(200).json({ subscription })
}

// @desc   Create subscription (user/admin)
// @route  POST /api/v1/subscriptions
export const createSubscription = async (req, res) => {
  const subscription = await Subscription.create({ ...req.body, user: req.user.id })

  res.status(201).json({ subscription })
}

// @desc   Update subscription (user/admin)
// @route  PATCH /api/v1/subscriptions/:id
export const updateSubscription = async (req, res) => {
  const id = req.params.id
  const subscription = await Subscription.findById(id)

  // check if the user who want to update the sub is not the same that who created it
  // and if the user is not admin
  if (req.user.id !== subscription.user && req.user.role !== 'admin') {
    throw Object.assign(new Error('Forbidden resource'), { statusCode: 403 })
  }

  if (!subscription) throw Object.assign(new Error('Subscription not found'), { statusCode: 404 })

  const {
    name,
    price,
    currency,
    frequency,
    category,
    paymentMethod,
    status,
    startDate,
    renewalDate
  } = req.body

  if (!name && !price && !currency && !frequency && !category && !paymentMethod && !status && !startDate && !renewalDate) {
    throw Object.assign(new Error('Fields cannot be empty'), { statusCode: 400 })
  }

  subscription.updateOne(subscription, { $set: req.body }, { new: true, runValidators: true })

  res.send(204).end()
}

// @desc   Remove subscription (user/admin)
// @route  DELETE /api/v1/subscriptions/:id
export const deleteSubscription = async (req, res) => {
  const id = req.params.id
  const subscription = await Subscription.findById(id)

  // check if the user who want to delete the sub is not the same that who created it
  // and if the user is not admin
  if (req.user.id !== subscription.user && req.user.role !== 'admin') {
    throw Object.assign(new Error('Forbidden resource'), { statusCode: 403 })
  }

  if (!subscription) throw Object.assign(new Error('Subscription not found'), { statusCode: 404 })

  await Subscription.deleteOne(subscription)

  res.status(204).end()
}

// @desc   Get all user subscriptions (user/admin)
// @route  GET /api/v1/subscriptions/users/:id
export const getUserSubscriptions = async (req, res) => {
  const id = req.params.id
  const user = await User.findById(id)

  // check if the user who want get the subs is not the same that who created them
  // and if the user is not admin
  if (req.user.id !== id && req.user.role !== 'admin') {
    throw Object.assign(new Error('Forbidden resource'), { statusCode: 403 })
  }

  if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 })

  const subscriptions = await Subscription.find({ user: id })

  if (subscriptions.length === 0) return res.status(200).json({ message: 'There are zero subscriptions' })

  res.status(200).json({ subscriptions })
}

// @desc   Cancel subscription (user)
// @route  PATCH /api/v1/subscriptions/:id/cancel
export const cancelSubscription = async (req, res) => {
  const id = req.params.id
  const subscription = await Subscription.findById(id)

  // check if the user who want to cancel the sub is not the same that who created it
  if (req.user.id !== subscription.user) {
    throw Object.assign(new Error('Forbidden resource'), { statusCode: 403 })
  }

  if (!subscription) throw Object.assign(new Error('Subscription not found'), { statusCode: 404 })

  await Subscription.updateOne(subscription, { status: 'canceled' }, { new: true, runValidators: true })

  res.status(204).end()
}

// @desc   Get upcoming renewals (user)
// @route  GET /api/v1/subscriptions/upcoming-renewals
export const getUpcomingRenewals = async (req, res) => {
  const id = req.user.id
  const subscriptions = await Subscription.find({ user: id })

  if (subscriptions.length === 0) return res.status(200).json({ message: 'There are zero subscriptions' })

  const today = new Date()
  // get the subscriptions whose renewal date is imminent (within the next 3 days)
  const upcomingRenewals = subscriptions
    .filter(sub => (sub.renewalDate.getMonth() === today.getMonth() && sub.renewalDate.getDate() - today.getDate() < 3))
    .map(filteredsub => {
      return { name: filteredsub.name, renewalDate: filteredsub.renewalDate }
    })

  if (upcomingRenewals.length === 0) return res.status(200).json({ message: 'There are no upcoming renewals' })

  res.status(200).json({ upcomingRenewals })
}