const AddCommentUseCase = require("../../../../Applications/use_case/AddCommentUseCase");
const DeleteCommentOnThreadUseCase = require("../../../../Applications/use_case/DeleteCommentOnThreadUseCase");
const ReplyThreadUseCase = require("../../../../Applications/use_case/ReplyThreadUseCase");

class CommentHandler {
    constructor(container) {
        this._container = container
    }

    async postCommentHandler(request, h) {
        const {threadId} = request.params;
        const {id: userId} = request.auth.credentials;
        const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
        const addedComment = await addCommentUseCase.execute(request.payload, threadId, userId);
        const response = h.response({
            status: 'success',
            data: {
                addedComment
            },
        });
        response.code(201);
        return response;
    }

    async deleteCommentHandler(request, h) {
        const {commentId, threadId} = request.params;
        const {id: userId} = request.auth.credentials;
        const deleteCommentUseCase = this._container.getInstance(DeleteCommentOnThreadUseCase.name);
        await deleteCommentUseCase.execute(threadId, commentId, userId);
        const response = h.response({
            status: 'success',
            message: 'Komentar berhasil dihapus',
        });
        response.code(200);
        return response;
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

module.exports = CommentHandler