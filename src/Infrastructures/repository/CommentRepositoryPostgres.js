const CommentRepository = require("../../Domains/comments/CommentRepository");
const CreatedComment = require("../../Domains/comments/entities/CreatedComment");

class CommentRepositoryPostgres extends CommentRepository {

    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addComment(comment, threadId, userId) {
        const {content} = comment;
        const id = `comment-${this._idGenerator()}`;
        const date = new Date().toISOString();
        
        const query = {
            text: `INSERT INTO comments
                   VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, content, owner`,
            values: [id, threadId, content, userId, date, false],
        };
        const result = await this._pool.query(query);

        return new CreatedComment({...result.rows[0]});
    }
}

module.exports = CommentRepositoryPostgres;