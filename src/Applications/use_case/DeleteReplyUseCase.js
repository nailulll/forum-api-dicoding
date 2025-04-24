class DeleteReplyUseCase {
  constructor({ replyRepository, threadRepository, commentRepository }) {
    this._replyRepository = replyRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(replyId, commentId, threadId, userId) {
    await this._threadRepository.findThreadById(threadId);
    await this._commentRepository.findCommentById(commentId);
    await this._replyRepository.findReplyById(replyId);
    await this._replyRepository.verifyReplyOwner(replyId, userId);
    await this._replyRepository.deleteReply(replyId);
  }
}

module.exports = DeleteReplyUseCase;
