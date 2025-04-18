const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const DeleteCommentOnThreadUseCase = require("../DeleteCommentOnThreadUseCase");

describe("DeleteCommentOnThreadUseCase", () => {
    it("should orchestrating the delete comment on thread action correctly", async () => {

        const userId = "user-123";
        const threadId = "thread-123";
        const commentId = "comment-123";

        const mockCommentRepository = new CommentRepository();
        const mockThreadRepository = new ThreadRepository();

        mockThreadRepository.findThreadById = jest.fn().mockImplementation(() => Promise.resolve());
        mockCommentRepository.findCommentById = jest.fn().mockImplementation(() => Promise.resolve());
        mockCommentRepository.verifyCommentOwner = jest.fn().mockImplementation(() => Promise.resolve());
        mockCommentRepository.deleteComment = jest.fn().mockImplementation(() => Promise.resolve());


        const deleteCommentOnThreadUseCase = new DeleteCommentOnThreadUseCase({
            commentRepository: mockCommentRepository,
            threadRepository: mockThreadRepository,
        });

        const thread = await deleteCommentOnThreadUseCase.execute(threadId, commentId, userId);

        expect(mockThreadRepository.findThreadById).toBeCalledWith(threadId);
        expect(mockCommentRepository.findCommentById).toBeCalledWith(commentId);
        expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(commentId, userId);
        expect(mockCommentRepository.deleteComment).toBeCalledWith(commentId);

        expect(thread).toBeUndefined();
    });
});