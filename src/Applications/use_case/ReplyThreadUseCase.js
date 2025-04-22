const ReplyComment = require("../../Domains/replies/entities/ReplyComment");

class ReplyThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload, commentId, threadId, userId) {
    await this._threadRepository.findThreadById(threadId);
    await this._commentRepository.findCommentById(commentId);
    const replyComment = new ReplyComment(useCasePayload);
    return await this._replyRepository.addReply(
      replyComment,
      commentId,
      userId
    );
  }
}

module.exports = ReplyThreadUseCase;
