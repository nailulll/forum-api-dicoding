const LikeCommentRepository = require("../../../Domains/like_comments/LikeCommentRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const LikeCommentUseCase = require("../LikeCommentUseCase");

describe("LikeCommentUseCase", () => {
    const commentId = "comment-123"
    const userId = "user-123"
    const threadId = "thread-123"

    let mockLikeCommentRepository;
    let mockCommentRepository;
    let mockThreadRepository;
    let likeCommentUseCase;

    beforeEach(() => {
        mockLikeCommentRepository = new LikeCommentRepository();
        mockCommentRepository = new CommentRepository();
        mockThreadRepository = new ThreadRepository();

        mockThreadRepository.findThreadById = jest.fn().mockImplementation(() => Promise.resolve({
            id: threadId,
            title: "title",
            body: "body",
            date: new Date().toISOString(),
            username: "username",
        }));
        mockCommentRepository.findCommentById = jest.fn().mockImplementation(() => Promise.resolve({
            id: commentId,
            thread_id: threadId,
            content: "content",
            date: new Date().toISOString(),
            owner: "owner",
            is_delete: false,
        }));

        likeCommentUseCase = new LikeCommentUseCase({
            likeCommentRepository: mockLikeCommentRepository,
            commentRepository: mockCommentRepository,
            threadRepository: mockThreadRepository,
        });
    });

    it("should like the comment if not liked yet", async () => {
        mockLikeCommentRepository.findLikeComment = jest.fn().mockImplementation(() => Promise.resolve(false));
        mockLikeCommentRepository.likeComment = jest.fn().mockImplementation(() => Promise.resolve());

        await likeCommentUseCase.execute(commentId, userId, threadId);

        expect(mockThreadRepository.findThreadById).toBeCalledWith(threadId);
        expect(mockCommentRepository.findCommentById).toBeCalledWith(commentId);
        expect(mockLikeCommentRepository.findLikeComment).toBeCalledWith(commentId, userId);
        expect(mockLikeCommentRepository.likeComment).toBeCalledWith(commentId, userId);
    });

    it("should unlike the comment if already liked", async () => {
        mockLikeCommentRepository.findLikeComment = jest.fn().mockImplementation(() => Promise.resolve(true));
        mockLikeCommentRepository.unlikeComment = jest.fn().mockImplementation(() => Promise.resolve());

        await likeCommentUseCase.execute(commentId, userId, threadId);

        expect(mockThreadRepository.findThreadById).toBeCalledWith(threadId);
        expect(mockCommentRepository.findCommentById).toBeCalledWith(commentId);
        expect(mockLikeCommentRepository.findLikeComment).toBeCalledWith(commentId, userId);
        expect(mockLikeCommentRepository.unlikeComment).toBeCalledWith(commentId, userId);
    });
});
