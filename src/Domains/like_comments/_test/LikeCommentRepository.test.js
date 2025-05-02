const LikeCommentRepository = require("../LikeCommentRepository");

describe("LikeCommentRepository interface", () => {
    it("should throw error when invoke abstract behavior", async () => {
        // Arrange
        const likeCommentRepository = new LikeCommentRepository();

        // Action & Assert
        await expect(likeCommentRepository.likeComment(null, null)).rejects.toThrowError(
            "LIKE_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED"
        );
        await expect(likeCommentRepository.unlikeComment(null, null)).rejects.toThrowError(
            "LIKE_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED"
        );
        await expect(likeCommentRepository.findLikeComment(null, null)).rejects.toThrowError(
            "LIKE_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED"
        );
    });
});