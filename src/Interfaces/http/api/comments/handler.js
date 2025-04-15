const AddCommentUseCase = require("../../../../Applications/use_case/AddCommentUseCase");

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
}

module.exports = CommentHandler