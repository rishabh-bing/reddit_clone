const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const { body, param, query } = require("express-validator");
const { validate } = require("../../utils/route.utils");
const SubscriptionsHandler = require("../../handler/subscription.handler");
const { isAuthenticated } = require("../../middlewares/auth.middleware");

// Validate subscription request body
const subscriptionBodyValidators = [
    body("subredditId")
        .exists()
        .withMessage("Subreddit ID field should be present")
        .isNumeric()
        .withMessage("Subreddit ID should be a number"),
];

// Validate user ID query parameter
const userIdParamValidator = [
    param("userId")
        .exists()
        .withMessage("User ID should be present")
        .isNumeric()
        .withMessage("User ID should be a number"),
];

router.post(
    "/",
    ...subscriptionBodyValidators,
    validate,
    isAuthenticated,
    asyncHandler(SubscriptionsHandler.subscribeToSubreddit)
);

router.get(
    "/:userId/subscriptions",
    ...userIdParamValidator,
    validate,
    isAuthenticated,
    asyncHandler(SubscriptionsHandler.getUserSubscriptions)
);

module.exports = router;
