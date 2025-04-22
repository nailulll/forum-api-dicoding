const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ReplyThreadUseCase = require("../ReplyThreadUseCase");
const AddedReply = require("../../../Domains/replies/entities/AddedReply");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");

describe("ReplyThreadUseCase", () => {
  it("should orchestrating the add reply action correctly", async () => {
    const useCasePayload = { content: "content" };
    const commentId = "comment-123";
    const threadId = "thread-123";
    const userId = "user-123";

    const mockReply = new AddedReply({
      id: "reply-123",
      content: useCasePayload.content,
      owner: userId,
    });
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.findThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.findCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.addReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockReply));

    const replyThreadUseCase = new ReplyThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const reply = await replyThreadUseCase.execute(
      useCasePayload,
      commentId,
      threadId,
      userId
    );

    expect(mockThreadRepository.findThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.findCommentById).toBeCalledWith(commentId);
    expect(mockReplyRepository.addReply).toBeCalledWith(
      useCasePayload,
      commentId,
      userId
    );
    expect(reply).toStrictEqual(mockReply);
  });
});
