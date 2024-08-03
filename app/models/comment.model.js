const { Model } = require("objection");
const { redditCloneDB } = require("../../connections/postgres.init");
const nodemailer = require("nodemailer");

const { DoesNotExistError } = require("../utils/errors.utils.js");

Model.knex(redditCloneDB);

class CommentModel extends Model {
    static get tableName() {
        return "comment";
    }

    static get idColumn() {
        return "_id";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["content"],
            properties: {
                _id: { type: "number" },
                userId: { type: "number" },
                postId: { type: "number" },
                content: { type: "string", minLength: 1, maxLength: 255 },
                createdAt: { type: "string" },
                updatedAt: { type: "string" },
            },
        };
    }

    async $beforeInsert() {
        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }

    async $beforeUpdate(opt) {
        this.updatedAt = new Date().toISOString();
        delete this.createdAt;
    }

    static async createComment(comment) {
        try {
            return await this.query().insertAndFetch({
                userId: comment.userId,
                postId: comment.postId,
                content: comment.content,
            });
        } catch (err) {
            throw err;
        }
    }

    static async updateComment(commentId, comment) {
        try {
            const existingComment = await this.query().findById(commentId);

            if (!existingComment) {
                throw new DoesNotExistError("No comment found to update");
            }

            return await this.query().patchAndFetchById(commentId, {
                userId: comment.userId,
                postId: comment.postId,
                content: comment.content,
            });
        } catch (err) {
            throw err;
        }
    }

    static async getComment(filters) {
        return await this.query().findOne(filters);
    }

    static async getCommentById(commentId) {
        return await this.query().findById(commentId);
    }

    static async getPostComments(postId) {
        return await this.query().where("postId", postId);
    }

    static async getComments(pageNo, pageSize, searchTag) {
        const query = this.query().orderBy("createdAt", "desc");

        if (searchTag) {
            let splitSearch = searchTag.split(",");
            query.where("tags", "@>", splitSearch);
        }

        return await query.page(pageNo, pageSize);
    }

    static async getCommentsByUserId({ userId, pageNo, pageSize, searchTag }) {
        const query = this.query()
            .where("userId", userId)
            .orderBy("createdAt", "desc");

        if (searchTag) {
            let splitSearch = searchTag.split(",");
            query.where("tags", "@>", splitSearch);
        }

        return await query.page(pageNo, pageSize);
    }

    static async deleteCommentById({ userId, commentId }) {
        try {
            return await this.query()
                .delete()
                .where("_id", commentId)
                .where("userId", userId)
                .returning("*");
        } catch (err) {
            throw err;
        }
    }
}

module.exports = CommentModel;
