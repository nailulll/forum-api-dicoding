const Comment = require('../../comments/entities/Comment');

class Thread {
    constructor(payload) {
        this._verifyPayload(payload);

        this.id = payload.id;
        this.title = payload.title;
        this.body = payload.body;
        this.date = payload.date;
        this.username = payload.username;
        this.comments = payload.comments;
    }

    _verifyPayload(payload) {
        const {id, title, body, date, username, comments} = payload;

        if (!id || !title || !body || !date || !username || !comments) {
            throw new Error('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof id !== 'string' || typeof title !== 'string' || typeof body !== 'string' || typeof date !== 'string' || typeof username !== 'string') {
            throw new Error('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }

        if (!Array.isArray(comments) || !comments.every(comment => comment instanceof Comment)) {
            throw new Error('THREAD.COMMENTS_NOT_ARRAY_OF_COMMENT');
        }
    }
}

module.exports = Thread;