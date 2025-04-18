class DeleteCommentOnThreadUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(threadId, commentId, userId) {
    await this._threadRepository.findThreadById(threadId);
    await this._commentRepository.findCommentById(commentId);
    await this._commentRepository.verifyCommentOwner(commentId, userId);
    await this._commentRepository.deleteComment(commentId);
  }
}

module.exports = DeleteCommentOnThreadUseCase;
