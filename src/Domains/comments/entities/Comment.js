class Comment {
    constructor(payload) {
        this._verifyPayload(payload);

        this.id = payload.id;
        this.content = payload.content;
        this.date = payload.date;
        this.owner = payload.owner;
    }

    _verifyPayload(payload) {
        const {id, content, date, owner} = payload;

        if (!id || !content || !date || !owner) {
            throw new Error('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof id !== 'string' || typeof content !== 'string' || typeof date !== 'string' || typeof owner !== 'string') {
            throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = Comment;