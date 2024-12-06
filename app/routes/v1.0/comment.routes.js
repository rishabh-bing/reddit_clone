const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const { body, param } = require("express-validator");
const { validate } = require("../../utils/route.utils");
const CommentsHandler = require("../../handler/comment.handler");
const { isAuthenticated } = require("../../middlewares/auth.middleware");

const commentBodyValidators = [
    body("content")
        .exists()
        .withMessage("Content field should be present")
        .isString()
        .withMessage("Content field value should be a string")
        .isLength({ min: 1, max: 1000 })
        .withMessage(
            "Content field value length should be between 1 to 1000 characters"
        ),
    body("postId")
        .exists()
        .withMessage("Post ID field should be present")
        .isNumeric()
        .withMessage("Post ID should be a number"),
];

router.post(
    "/",
    ...commentBodyValidators,
    validate,
    isAuthenticated,
    asyncHandler(CommentsHandler.createComment)
);

module.exports = router;
