const CommentModel = require("../models/comment.model");
const { DoesNotExistError } = require("../utils/errors.utils");

const CommentHandler = {
    createComment: async (req, res) => {
        const { userId } = req;

        const { postId, content } = req.body;

        try {
            const newComment = await CommentModel.createComment({
                userId,
                postId,
                content,
            });
            res.status(201).json({
                message: "Comment created successfully",
                newComment,
            });
        } catch (err) {
            if (err.errorCode) throw err;
            err.customMessage =
                "Unable to create comment, please try again later.";
            throw err;
        }
    },

    updateComment: async (req, res) => {
        const { userId } = req;

        const { commentId } = req.params;
        const { postId, content } = req.body;

        try {
            const updatedComment = await CommentModel.updateComment(commentId, {
                userId,
                postId,
                content,
            });

            if (!updatedComment) {
                throw new DoesNotExistError("No comment found to update");
            }

            res.json({
                message: "Comment updated successfully",
                updatedComment,
            });
        } catch (err) {
            if (err.errorCode) throw err;
            err.customMessage =
                "Unable to update comment, please try again later.";
            throw err;
        }
    },

    getComment: async (req, res) => {
        const { commentId } = req.params;

        try {
            const comment = await CommentModel.getCommentById(commentId);

            if (!comment) {
                throw new DoesNotExistError("No comment found");
            }

            res.json(comment);
        } catch (err) {
            if (err.errorCode) throw err;
            err.customMessage =
                "Unable to fetch comment, please try again later.";
            throw err;
        }
    },

    getPostComment: async (req, res) => {
        const { postId } = req.params;

        try {
            const comment = await CommentModel.getPostComments(postId);

            if (!comment) {
                throw new DoesNotExistError("No comment found");
            }

            res.json(comment);
        } catch (err) {
            if (err.errorCode) throw err;
            err.customMessage =
                "Unable to fetch comment, please try again later.";
            throw err;
        }
    },

    getComments: async (req, res) => {
        const { pageNo = 1, pageSize = 10, searchTag } = req.query;

        try {
            const result = await CommentModel.getComments(
                pageNo - 1,
                pageSize,
                searchTag
            );
            const { results: items, total: itemTotal } = result;

            const page = {
                type: "number",
                size: items.length,
                current: pageNo,
                hasNext: pageNo * pageSize < itemTotal,
                itemTotal,
            };

            res.json({ page, items });
        } catch (err) {
            err.customMessage =
                "Unable to fetch comments, please try again later.";
            throw err;
        }
    },

    getCommentsByUserId: async (req, res) => {
        const { userId } = req;
        const { pageNo = 1, pageSize = 10, searchTag } = req.query;

        try {
            const result = await CommentModel.getCommentsByUserId({
                userId,
                pageNo: pageNo - 1,
                pageSize,
                searchTag,
            });
            const { results: items, total: itemTotal } = result;

            const page = {
                type: "number",
                size: items.length,
                current: pageNo,
                hasNext: pageNo * pageSize < itemTotal,
                itemTotal,
            };

            res.json({ page, items });
        } catch (err) {
            err.customMessage =
                "Unable to fetch comments for user, please try again later.";
            throw err;
        }
    },

    deleteComment: async (req, res) => {
        const { userId } = req;
        const { commentId } = req.params;

        try {
            const deletedComment = await CommentModel.deleteCommentById({
                userId,
                commentId,
            });

            if (!deletedComment) {
                throw new DoesNotExistError("No comment found to delete");
            }

            res.json({
                message: "Comment deleted successfully",
                deletedComment,
            });
        } catch (err) {
            if (err.errorCode) throw err;
            err.customMessage =
                "Unable to delete comment, please try again later.";
            throw err;
        }
    },
};

module.exports = CommentHandler;
