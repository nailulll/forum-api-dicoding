const AddedReply = require("../../Domains/replies/entities/AddedReply");
const ReplyRepository = require("../../Domains/replies/ReplyRepository");

class ReplyRepositoryPostgres extends ReplyRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addReply(reply, commentId, userId) {
        const {content} = reply;
        const id = `reply-${this._idGenerator()}`;
        const date = new Date().toISOString();

        const query = {
            text: `INSERT INTO replies
                   VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, content, owner`,
            values: [id, commentId, content, userId, date, false],
        };

        const result = await this._pool.query(query);
        return new AddedReply({...result.rows[0]});
    }

    async deleteReply(replyId) {

    }

}

module.exports = ReplyRepositoryPostgres;