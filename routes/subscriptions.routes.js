import { Router } from "express";
import { 
  getSubscriptions,
  getSubscription,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  getUserSubscriptions,
  cancelSubscription,
  getUpcomingRenewals
} from "../controllers/subscriptions.controller.js";
const subscriptionRouter = Router()

// path: /api/v1/subscriptions
subscriptionRouter.route('/').get(getSubscriptions).post(createSubscription)
subscriptionRouter.get('/upcoming-renewals', getUpcomingRenewals)
subscriptionRouter.route('/:id').get(getSubscription).patch(updateSubscription).delete(deleteSubscription)
subscriptionRouter.get('/users/:id', getUserSubscriptions)
subscriptionRouter.patch('/:id/cancel', cancelSubscription)

export default subscriptionRouter