const pool = require("../src/Infrastructures/database/postgres/pool");

const ReplyTableTestHelper = {
    async addReply({id = 'reply-123', commentId = 'comment-123', owner = 'user-123', content = 'content'}) {
        const date = new Date().toISOString();
        const query = {
            text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6)',
            values: [id, commentId, content, owner, date, false],
        };
        await pool.query(query);
    },

    async findRepliesById(id) {
        const query = {
            text: 'SELECT * FROM replies WHERE id = $1',
            values: [id],
        };
        const result = await pool.query(query);
        return result.rows;
    },

    async deleteReplyById(id) {
        const query = {
            text: 'UPDATE replies SET is_delete = true WHERE id = $1',
            values: [id],
        };
        await pool.query(query);
    },

    async cleanTable() {
        await pool.query('DELETE FROM replies');
    },
}

module.exports = ReplyTableTestHelper