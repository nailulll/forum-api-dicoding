const CreateComment = require("../../Domains/comments/entities/CreateComment");

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, threadId, userId) {
    const createComment = new CreateComment(useCasePayload);
    await this._threadRepository.findThreadById(threadId);
    return await this._commentRepository.addComment(
      createComment,
      threadId,
      userId
    );
  }
}

module.exports = AddCommentUseCase;
