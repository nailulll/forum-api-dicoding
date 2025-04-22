const ReplyThreadUseCase = require("../../../../Applications/use_case/ReplyThreadUseCase");

class RepliesHandler {

    constructor(container) {
        this._container = container;
    }

    async replyCommentHandler(request, h) {
        const {commentId, threadId} = request.params;
        const {id: userId} = request.auth.credentials;
        const replyThreadUseCase = this._container.getInstance(ReplyThreadUseCase.name);
        const addedReply = await replyThreadUseCase.execute(request.payload, commentId, threadId, userId);
        const response = h.response({
            status: 'success',
            data: {
                addedReply,
            },
        });
        response.code(201);
        return response;
    }
}

module.exports = RepliesHandler;