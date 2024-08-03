const PostModel = require("../models/post.model");
const VoteModel = require("../models/vote.model");
const { DoesNotExistError } = require("../utils/errors.utils");

const PostHandler = {
    createPost: async (req, res) => {
        const { userId } = req;
        const { subredditId, title, content } = req.body;

        try {
            const newPost = await PostModel.createPost({
                userId,
                subredditId,
                title,
                content,
            });
            res.status(201).json({
                message: "Post created successfully",
                newPost,
            });
        } catch (err) {
            if (err.errorCode) throw err;
            err.customMessage =
                "Unable to create post, please try again later.";
            throw err;
        }
    },

    updatePost: async (req, res) => {
        const { userId } = req;
        const { postId } = req.params;
        const { subredditId, title, content } = req.body;

        try {
            const updatedPost = await PostModel.updatePost(postId, {
                userId,
                subredditId,
                title,
                content,
            });

            if (!updatedPost) {
                throw new DoesNotExistError("No post found to update");
            }

            res.json({ message: "Post updated successfully", updatedPost });
        } catch (err) {
            if (err.errorCode) throw err;
            err.customMessage =
                "Unable to update post, please try again later.";
            throw err;
        }
    },

    getPost: async (req, res) => {
        const { postId } = req.params;

        try {
            const post = await PostModel.getPostById(postId);

            if (!post) {
                throw new DoesNotExistError("No post found");
            }

            res.json(post);
        } catch (err) {
            if (err.errorCode) throw err;
            err.customMessage = "Unable to fetch post, please try again later.";
            throw err;
        }
    },

    getPosts: async (req, res) => {
        const { pageNo = 1, pageSize = 10, searchTag } = req.query;

        try {
            const result = await PostModel.getPosts(
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
                "Unable to fetch posts, please try again later.";
            throw err;
        }
    },

    getPostsByUserId: async (req, res) => {
        const { userId } = req.params;
        const { pageNo = 1, pageSize = 10, searchTag } = req.query;

        try {
            const result = await PostModel.getPostsByUserId({
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
                "Unable to fetch posts for user, please try again later.";
            throw err;
        }
    },

    deletePost: async (req, res) => {
        const { userId, postId } = req.params;

        try {
            const deletedPost = await PostModel.deletePostById({
                userId,
                postId,
            });

            if (!deletedPost) {
                throw new DoesNotExistError("No post found to delete");
            }

            res.json({ message: "Post deleted successfully", deletedPost });
        } catch (err) {
            if (err.errorCode) throw err;
            err.customMessage =
                "Unable to delete post, please try again later.";
            throw err;
        }
    },
    getVotesForPost: async (req, res) => {
        const { postId } = req.params;

        const post = await PostModel.query().findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        try {
            const votes = await VoteModel.query().where({ postId });
            res.json(votes);
        } catch (err) {
            res.status(500).json({
                message: "Failed to retrieve votes",
                error: err.message,
            });
        }
    },
};

module.exports = PostHandler;
