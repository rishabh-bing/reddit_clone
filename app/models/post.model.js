const { Model } = require("objection");
const { redditCloneDB } = require("../../connections/postgres.init");
const nodemailer = require("nodemailer");

const { DoesNotExistError } = require("../utils/errors.utils.js");

Model.knex(redditCloneDB);

class PostModel extends Model {
    static get tableName() {
        return "post";
    }

    static get idColumn() {
        return "_id";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["title", "content"],
            properties: {
                _id: { type: "number" },
                userId: { type: "number" },
                subredditId: { type: "number" },
                title: { type: "string", minLength: 1, maxLength: 255 },
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

    static async createPost(post) {
        try {
            return await this.query().insertAndFetch({
                userId: post.userId,
                subredditId: post.subredditId,
                title: post.title,
                content: post.content,
            });
        } catch (err) {
            throw err;
        }
    }

    static async updatePost(postId, post) {
        try {
            const existingPost = await this.query().findById(postId);

            if (!existingPost) {
                throw new DoesNotExistError("No post found to update");
            }

            return await this.query().patchAndFetchById(postId, {
                userId: post.userId,
                subredditId: post.subredditId,
                title: post.title,
                content: post.content,
            });
        } catch (err) {
            throw err;
        }
    }

    static async getPost(filters) {
        return await this.query().findOne(filters);
    }

    static async getPostById(postId) {
        return await this.query().findById(postId);
    }

    static async getPosts(pageNo, pageSize, searchTag) {
        const query = this.query().orderBy("createdAt", "desc");

        if (searchTag) {
            let splitSearch = searchTag.split(",");
            query.where("tags", "@>", splitSearch);
        }

        return await query.page(pageNo, pageSize);
    }

    static async getPostsByUserId({ userId, pageNo, pageSize, searchTag }) {
        const query = this.query()
            .where("userId", userId)
            .orderBy("createdAt", "desc");

        if (searchTag) {
            let splitSearch = searchTag.split(",");
            query.where("tags", "@>", splitSearch);
        }

        return await query.page(pageNo, pageSize);
    }

    static async deletePostById({ userId, postId }) {
        try {
            return await this.query()
                .delete()
                .where("_id", postId)
                .where("userId", userId)
                .returning("*");
        } catch (err) {
            throw err;
        }
    }
}

module.exports = PostModel;
