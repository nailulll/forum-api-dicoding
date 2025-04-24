const AddedReply = require("../../Domains/replies/entities/AddedReply");
const ReplyRepository = require("../../Domains/replies/ReplyRepository");
const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(reply, commentId, userId) {
    const { content } = reply;
    const id = `reply-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: `INSERT INTO replies
                   VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, content, owner`,
      values: [id, commentId, content, userId, date, false],
    };

    const result = await this._pool.query(query);
    return new AddedReply({ ...result.rows[0] });
  }

  async deleteReply(replyId) {
    const query = {
      text: "UPDATE replies SET is_delete = true WHERE id = $1",
      values: [replyId],
    };

    await this._pool.query(query);
  }

  async verifyReplyOwner(replyId, userId) {
    const query = {
      text: "SELECT * FROM replies WHERE id = $1 AND owner = $2",
      values: [replyId, userId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new AuthorizationError("anda tidak berhak mengakses resource ini");
    }

    return result.rows[0];
  }

  async findReplyById(replyId) {
    const query = {
      text: "SELECT * FROM replies WHERE id = $1",
      values: [replyId],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("balasan tidak ditemukan");
    }

    return result.rows[0];
  }

  async getRepliesByCommentIds(commentIds) {
    const query = {
      text: `
          SELECT r.id, r.content, r.date, r.is_delete, r.comment_id, u.username
          FROM replies r
                   JOIN users u ON r.owner = u.id
          WHERE r.comment_id = ANY ($1::text[])
          ORDER BY r.date
      `,
      values: [commentIds],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = ReplyRepositoryPostgres;
