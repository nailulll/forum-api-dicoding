const LikeCommentUseCase = require("../../../../Applications/use_case/LikeCommentUseCase");

class LikeCommentsHandler {
    constructor(container) {
        this._container = container;
    }

    async postLikeCommentHandler(request, h) {
        const { id: userId } = request.auth.credentials;
        const { threadId, commentId } = request.params;

        const likeCommentUseCase = this._container.getInstance(LikeCommentUseCase.name);
        await likeCommentUseCase.execute(commentId, userId, threadId);
        return {
            status: "success"
        };
    }

}

module.exports = LikeCommentsHandler;