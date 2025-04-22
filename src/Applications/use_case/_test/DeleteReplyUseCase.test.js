const DeleteReplyUseCase = require("../DeleteReplyUseCase");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");

describe("DeleteReplyUseCase", () => {
  it("should orchestrating the delete reply action correctly", async () => {
    const replyId = "reply-123";
    const threadId = "thread-123";
    const userId = "user-123";
    const commentId = "comment-123";

    const mockReplyRepository = new ReplyRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.findThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.findCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockReplyRepository.findReplyById = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    await deleteReplyUseCase.execute(replyId, commentId, threadId, userId);

    expect(mockThreadRepository.findThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.findCommentById).toBeCalledWith(commentId);
    expect(mockReplyRepository.findReplyById).toBeCalledWith(replyId);
    expect(mockReplyRepository.verifyReplyOwner).toBeCalledWith(
      replyId,
      userId
    );
    expect(mockReplyRepository.deleteReply).toBeCalledWith(replyId);
  });
});
