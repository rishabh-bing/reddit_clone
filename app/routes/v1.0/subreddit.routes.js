const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const { body, param } = require("express-validator");
const { validate } = require("../../utils/route.utils");
const SubredditsHandler = require("../../handler/subreddit.handler");
const { isAuthenticated } = require("../../middlewares/auth.middleware");

const subredditBodyValidators = [
    body("name")
        .exists()
        .withMessage("Name field should be present")
        .isString()
        .withMessage("Name field value should be a string")
        .isLength({ min: 1, max: 255 })
        .withMessage(
            "Name field value length should be between 1 to 255 characters"
        ),
    body("description")
        .optional()
        .isString()
        .withMessage("Description field value should be a string")
        .isLength({ max: 1000 })
        .withMessage(
            "Description field value length should not exceed 1000 characters"
        ),
];

router.post(
    "/",
    ...subredditBodyValidators,
    validate,
    isAuthenticated,
    asyncHandler(SubredditsHandler.createSubreddit)
);

router.get(
    "/:subredditId",
    param("subredditId")
        .exists()
        .withMessage("Subreddit ID should be present")
        .isNumeric()
        .withMessage("Subreddit ID should be a number"),
    validate,
    isAuthenticated,
    asyncHandler(SubredditsHandler.getSubreddit)
);

router.get(
    "/:subredditId/posts",
    param("subredditId")
        .exists()
        .withMessage("Subreddit ID should be present")
        .isNumeric()
        .withMessage("Subreddit ID should be a number"),
    validate,
    isAuthenticated,
    asyncHandler(SubredditsHandler.getSubredditWithPosts)
);

module.exports = router;
