/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentTableTestHelper = {

    async addComment({id = 'comment-123', threadId = 'thread-123', owner = 'user-123', content = 'content'}) {
        const date = new Date().toISOString();
        const query = {
            text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6)',
            values: [id, threadId, content, owner, date, false],
        };
        await pool.query(query);
    },

    async findCommentsById(id) {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1',
            values: [id],
        };
        const result = await pool.query(query);
        return result.rows;
    },

    async cleanTable() {
        await pool.query('DELETE FROM comments');
    },
};

module.exports = CommentTableTestHelper;