const ReplyThreadUseCase = require("../../../../Applications/use_case/ReplyThreadUseCase");
const DeleteReplyUseCase = require("../../../../Applications/use_case/DeleteReplyUseCase");

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

    async deleteReplyHandler(request, h) {
        const {replyId, threadId, commentId} = request.params;
        const {id: userId} = request.auth.credentials;
        const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name);
        await deleteReplyUseCase.execute(replyId, commentId, threadId, userId);
        const response = h.response({
            status: 'success',
            message: 'Balasan berhasil dihapus',
        });
        response.code(200);
        return response;
    }
}

module.exports = RepliesHandler;