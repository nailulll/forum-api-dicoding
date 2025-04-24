const ReplyRepository = require("../ReplyRepository");

describe("ReplyRepository interface", () => {
    it("should throw error when invoke abstract behavior", async () => {
        // Arrange
        const replyRepository = new ReplyRepository();

        // Action & Assert
        await expect(replyRepository.addReply({}, null, null)).rejects.toThrowError(
            "REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED"
        );
        await expect(replyRepository.deleteReply(null)).rejects.toThrowError(
            "REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED"
        );
        await expect(replyRepository.findReplyById(null)).rejects.toThrowError(
            "REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED"
        );
        await expect(
            replyRepository.verifyReplyOwner(null, null)
        ).rejects.toThrowError("REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
        await expect(
            replyRepository.getRepliesByCommentIds([])
        ).rejects.toThrowError(
            "REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED"
        );
    });
});
