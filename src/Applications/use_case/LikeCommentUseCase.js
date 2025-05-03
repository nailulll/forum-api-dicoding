class LikeCommentUseCase {
    constructor({commentRepository, likeCommentRepository, threadRepository}) {
        this._commentRepository = commentRepository;
        this._likeCommentRepository = likeCommentRepository;
        this._threadRepository = threadRepository;
    }

    async execute(commentId, userId, threadId) {
        await this._threadRepository.findThreadById(threadId);
        await this._commentRepository.findCommentById(commentId);
        const likedComment = await this._likeCommentRepository.findLikeComment(commentId, userId);
        if (likedComment) {
            await this._likeCommentRepository.unlikeComment(commentId, userId);
        } else {
            await this._likeCommentRepository.likeComment(commentId, userId);
        }
    }
}

module.exports = LikeCommentUseCase;