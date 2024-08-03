const VoteModel = require("../models/vote.model");
const { DoesNotExistError } = require("../utils/errors.utils");

const VoteHandler = {
    createVote: async (req, res) => {
        const { userId } = req;
        const { postId } = req.params;
        const { vote } = req.body;
        try {
            const newVote = await VoteModel.votePost({
                userId,
                postId,
                vote,
            });
            res.status(201).json({
                message: "Vote created successfully",
                newVote,
            });
        } catch (err) {
            if (err.errorCode) throw err;
            err.customMessage =
                "Unable to create vote, please try again later.";
            throw err;
        }
    },
};

module.exports = VoteHandler;
