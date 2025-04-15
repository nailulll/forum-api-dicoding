/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentTableTestHelper = {
    async cleanTable() {
        await pool.query('DELETE FROM comments');
    },
};

module.exports = CommentTableTestHelper;