const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ReplyThreadUseCase = require("../ReplyThreadUseCase");
const AddedReply = require("../../../Domains/comments/entities/AddedReply");

describe("ReplyThreadUseCase", () => {
    it("should orchestrating the add reply action correctly", async () => {
        const useCasePayload = {content: "content"};
        const commentId = "comment-123";
        const threadId = "thread-123";
        const userId = "user-123";

        const mockReply = new AddedReply({id: "comment-123", content: useCasePayload.content, owner: userId});
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();

        mockThreadRepository.findThreadById = jest.fn().mockImplementation(() => Promise.resolve());
        mockCommentRepository.findCommentById = jest.fn().mockImplementation(() => Promise.resolve());
        mockCommentRepository.replyComment = jest.fn().mockImplementation(() => Promise.resolve(mockReply));

        const replyThreadUseCase = new ReplyThreadUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
        });

        const reply = await replyThreadUseCase.execute(useCasePayload, commentId, threadId, userId);

        expect(mockThreadRepository.findThreadById).toBeCalledWith(threadId);
        expect(mockCommentRepository.findCommentById).toBeCalledWith(commentId);
        expect(mockCommentRepository.replyComment).toBeCalledWith(useCasePayload, commentId, threadId, userId);
        expect(reply).toStrictEqual(mockReply);
    });
});