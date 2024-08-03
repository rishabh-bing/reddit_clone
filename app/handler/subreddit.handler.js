const SubredditModel = require("../models/subreddit.model");
const { DoesNotExistError } = require("../utils/errors.utils");

const SubredditHandler = {
    createSubreddit: async (req, res) => {
        const { userId } = req;
        const { name, description } = req.body;

        try {
            const subreddit = await SubredditModel.createSubreddit({
                userId,
                name,
                description,
            });
            res.status(201).json({
                message: "Subreddit created successfully",
                subreddit,
            });
        } catch (err) {
            if (err.errorCode) throw err;
            err.customMessage =
                "Unable to create subreddit, please try again later.";
            throw err;
        }
    },

    updateSubreddit: async (req, res) => {
        const { userId } = req;
        const { subredditId } = req.params;
        const { name, description } = req.body;

        try {
            const subreddit = await SubredditModel.updateSubreddit(
                subredditId,
                { userId, name, description }
            );

            if (!subreddit) {
                throw new DoesNotExistError("No subreddit found to update");
            }

            res.json({ message: "Subreddit updated successfully", subreddit });
        } catch (err) {
            if (err.errorCode) throw err;
            err.customMessage =
                "Unable to update subreddit, please try again later.";
            throw err;
        }
    },

    getSubreddit: async (req, res) => {
        const { subredditId } = req.params;

        try {
            const subreddit = await SubredditModel.getSubredditById(
                subredditId
            );

            if (!subreddit) {
                throw new DoesNotExistError("No subreddit found");
            }

            res.json(subreddit);
        } catch (err) {
            if (err.errorCode) throw err;
            err.customMessage =
                "Unable to fetch subreddit, please try again later.";
            throw err;
        }
    },

    getSubreddits: async (req, res) => {
        const { pageNo = 1, pageSize = 10, searchTag } = req.query;

        try {
            const result = await SubredditModel.getSubreddits(
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
                "Unable to fetch subreddits, please try again later.";
            throw err;
        }
    },

    getSubredditsByUserId: async (req, res) => {
        const { userId } = req.params;
        const { pageNo = 1, pageSize = 10, searchTag } = req.query;

        try {
            const result = await SubredditModel.getSubredditsByUserId({
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
                "Unable to fetch subreddits for user, please try again later.";
            throw err;
        }
    },

    getSubredditWithPosts: async (req, res) => {
        const { subredditId } = req.params;

        try {
            const subreddit = await SubredditModel.getSubredditPosts({
                subredditId,
            });

            if (!subreddit) {
                throw new DoesNotExistError("No subreddit found");
            }

            res.json(subreddit);
        } catch (err) {
            if (err.errorCode) throw err;
            err.customMessage =
                "Unable to fetch subreddit with users, please try again later.";
            throw err;
        }
    },
    getSubredditWithUsers: async (req, res) => {
        const { userId, subredditId } = req.params;

        try {
            const subreddit = await SubredditModel.getSubredditWithUsers({
                userId,
                subredditId,
            });

            if (!subreddit) {
                throw new DoesNotExistError("No subreddit found");
            }

            res.json(subreddit);
        } catch (err) {
            if (err.errorCode) throw err;
            err.customMessage =
                "Unable to fetch subreddit with users, please try again later.";
            throw err;
        }
    },

    deleteSubreddit: async (req, res) => {
        const { userId, subredditId } = req.params;

        try {
            const deletedSubreddit = await SubredditModel.deleteSubredditById({
                userId,
                subredditId,
            });

            if (!deletedSubreddit) {
                throw new DoesNotExistError("No subreddit found to delete");
            }

            res.json({
                message: "Subreddit deleted successfully",
                deletedSubreddit,
            });
        } catch (err) {
            if (err.errorCode) throw err;
            err.customMessage =
                "Unable to delete subreddit, please try again later.";
            throw err;
        }
    },
};

module.exports = SubredditHandler;
