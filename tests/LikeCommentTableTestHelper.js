/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const LikeCommentTableTestHelper = {

    async addLikeComment({id = 'like_comment-123', commentId = 'comment-123', userId = 'user-123'}) {
        const date = new Date().toISOString();
        const query = {
            text: 'INSERT INTO like_comments VALUES($1, $2, $3, $4)',
            values: [id, commentId, userId, date],
        };

        await pool.query(query);
    },

    async findLikeCommentById(id) {
        const query = {
            text: 'SELECT * FROM like_comments WHERE id = $1',
            values: [id],
        };
        const result = await pool.query(query);
        return result.rows;
    },

    async getAll() {
        const result = await pool.query('SELECT * FROM like_comments');
        return result.rows;
    },

    async cleanTable() {
        await pool.query('DELETE FROM like_comments');
    },
};

module.exports = LikeCommentTableTestHelper;