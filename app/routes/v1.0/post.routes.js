const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const { body, param } = require("express-validator");
const { validate } = require("../../utils/route.utils");
const PostsHandler = require("../../handler/post.handler");
const CommentsHandler = require("../../handler/comment.handler");
const VotingHandler = require("../../handler/vote.handler");
const { isAuthenticated } = require("../../middlewares/auth.middleware");

const postBodyValidators = [
    body("title")
        .exists()
        .withMessage("Title field should be present")
        .isString()
        .withMessage("Title field value should be a string")
        .isLength({ min: 1, max: 255 })
        .withMessage(
            "Title field value length should be between 1 to 255 characters"
        ),
    body("content")
        .exists()
        .withMessage("Content field should be present")
        .isString()
        .withMessage("Content field value should be a string")
        .isLength({ min: 1, max: 10000 })
        .withMessage(
            "Content field value length should be between 1 to 10000 characters"
        ),
    body("subredditId")
        .exists()
        .withMessage("Subreddit ID field should be present")
        .isNumeric()
        .withMessage("Subreddit ID should be a number"),
];

router.post(
    "/",
    ...postBodyValidators,
    validate,
    isAuthenticated,
    asyncHandler(PostsHandler.createPost)
);

router.get(
    "/:postId",
    param("postId")
        .exists()
        .withMessage("Post ID should be present")
        .isNumeric()
        .withMessage("Post ID should be a number"),
    validate,
    isAuthenticated,
    asyncHandler(PostsHandler.getPost)
);

router.get(
    "/:postId/comments",
    param("postId")
        .exists()
        .withMessage("Post ID should be present")
        .isNumeric()
        .withMessage("Post ID should be a number"),
    validate,
    isAuthenticated,
    asyncHandler(CommentsHandler.getPostComment)
);

const voteBodyValidators = [
    body("vote")
        .exists()
        .withMessage("Vote field should be present")
        .isIn([1, 0, -1])
        .withMessage("Vote must be 1, 0, or -1"),
];

router.get(
    "/:postId/vote",
    param("postId")
        .exists()
        .withMessage("Post ID should be present")
        .toInt()
        .isNumeric()
        .withMessage("Post ID should be a number"),
    validate,
    isAuthenticated,
    asyncHandler(PostsHandler.getVotesForPost)
);

router.post(
    "/:postId/vote",
    ...voteBodyValidators,
    param("postId")
        .exists()
        .withMessage("Post ID should be present")
        .toInt()
        .isNumeric()
        .withMessage("Post ID should be a number"),
    validate,
    isAuthenticated,
    asyncHandler(VotingHandler.createVote)
);

module.exports = router;
