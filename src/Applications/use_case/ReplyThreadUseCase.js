const ReplyComment = require("../../Domains/comments/entities/ReplyComment");

class ReplyThreadUseCase {
    constructor({threadRepository, commentRepository}) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
    }

    async execute(useCasePayload, commentId, threadId, userId) {
        await this._threadRepository.findThreadById(threadId);
        await this._commentRepository.findCommentById(commentId);
        const replyComment = new ReplyComment(useCasePayload);
        return await this._commentRepository.replyComment(replyComment, commentId, threadId, userId);
    }
}

module.exports = ReplyThreadUseCase;