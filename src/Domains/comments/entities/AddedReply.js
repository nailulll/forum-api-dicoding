class AddedReply {
    constructor(props) {
        this._verifyPayload(props);

        this.id = props.id;
        this.content = props.content;
        this.owner = props.owner;
    }

    _verifyPayload(payload) {
        const {id, content, owner} = payload;
        if (!id || !content || !owner) {
            throw new Error('REPLY_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
        }
        if (typeof id !== 'string' || typeof content !== 'string' || typeof owner !== 'string') {
            throw new Error('REPLY_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = AddedReply;