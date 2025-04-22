const ReplyComment = require("../ReplyComment");

describe("ReplyComment entity", () => {
  it("should throw error when payload does not contain needed property", () => {
    expect(() => new ReplyComment({})).toThrowError(
      "REPLY_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload not meet data type specification", () => {
    // Arrange
    const payload = {
      content: 123,
    };

    // Action & Assert
    expect(() => new ReplyComment(payload)).toThrowError(
      "REPLY_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create ReplyComment entities correctly", () => {
    // Arrange
    const payload = {
      content: "content",
    };

    // Action & Assert
    const replyComment = new ReplyComment(payload);
    expect(replyComment.content).toEqual(payload.content);
  });
});
