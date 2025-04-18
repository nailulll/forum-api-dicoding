const CreatedComment = require("../../../Domains/comments/entities/CreatedComment");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const AddCommentUseCase = require("../AddCommentUseCase");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");

describe("AddCommentUseCase", () => {
    it("should orchestrating the add comment action correctly", async () => {
        const userId = "user-123";
        const threadId = "thread-123";
        const useCasePayload = {
            content: "content",
        };

        const mockCreatedComment = new CreatedComment({
            id: "comment-123",
            content: useCasePayload.content,
            owner: userId,
        });

        const mockCommentRepository = new CommentRepository();
        const mockThreadRepository = new ThreadRepository();

        mockThreadRepository.findThreadById = jest
            .fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentRepository.addComment = jest
            .fn()
            .mockImplementation(() => Promise.resolve(mockCreatedComment));

        const addCommentUseCase = new AddCommentUseCase({
            commentRepository: mockCommentRepository,
            threadRepository: mockThreadRepository,
        });

        const createdComment = await addCommentUseCase.execute(
            useCasePayload,
            threadId,
            userId
        );

        expect(mockThreadRepository.findThreadById).toBeCalledWith(threadId);
        expect(mockCommentRepository.addComment).toBeCalledWith(
            {
                content: useCasePayload.content,
            },
            threadId,
            userId
        );
        expect(createdComment).toStrictEqual(mockCreatedComment);
    });
});
