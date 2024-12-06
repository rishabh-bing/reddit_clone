const SubscriptionModel = require("../models/junction/Subscription.model");
const { DoesNotExistError } = require("../utils/errors.utils");

const SubscriptionHandler = {
    subscribeToSubreddit: async (req, res) => {
        const { userId } = req;
        const { subredditId } = req.body;

        try {
            const subscription = await SubscriptionModel.subscribeToSubreddit({
                userId,
                subredditId,
            });
            res.status(201).json({
                message: "Subscribed successfully",
                subscription,
            });
        } catch (err) {
            if (err.errorCode) throw err;
            err.subscriptionMessage =
                "Unable to Subscribe, please try again later.";
            throw err;
        }
    },

    getUserSubscriptions: async (req, res) => {
        const { userId } = req;

        try {
            const subscriptions = await SubscriptionModel.getUserSubscriptions(
                userId
            );

            res.json({
                subscriptions,
            });
        } catch (err) {
            if (err.errorCode) throw err;
            err.subscriptionMessage =
                "Unable to fetch subscriptions, please try again later.";

            throw err;
        }
    },
};

module.exports = SubscriptionHandler;
