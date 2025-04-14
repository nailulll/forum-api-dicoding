class CreateThread {
    constructor(payload) {
        this._verifyPayload(payload);

        this.title = payload.title;
        this.body = payload.body;
    }

    _verifyPayload(payload) {
        const {title, body} = payload;
        if (!title || !body) {
            throw new Error('CREATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof title !== 'string' || typeof body !== 'string') {
            throw new Error('CREATE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = CreateThread;