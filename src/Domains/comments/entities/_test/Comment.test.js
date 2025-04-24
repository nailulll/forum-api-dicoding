const Comment = require("../Comment");
const Reply = require("../../../replies/entities/Reply");

describe("Comment entity", () => {
  it("should throw error when payload does not contain needed property", () => {
    // Action & Assert
    expect(() => new Comment({})).toThrowError(
      "COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload not meet data type specification", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      content: 123,
      date: "2021-01-01",
      username: "user-123",
    };

    // Action & Assert
    expect(() => new Comment(payload)).toThrowError(
      "COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should throw error when payload replies not meet data type specification", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      content: "content",
      date: "2021-01-01",
      username: "user-123",
      replies: "replies",
    };

    // Action & Assert
    expect(() => new Comment(payload)).toThrowError(
      "COMMENT.REPLIES_NOT_ARRAY"
    );
  });

  it("should throw error when payload replies not meet data type specification", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      content: "content",
      date: "2021-01-01",
      username: "user-123",
      replies: [{}],
    };

    // Action & Assert
    expect(() => new Comment(payload)).toThrowError(
      "COMMENT.REPLIES_NOT_ARRAY_OF_REPLY"
    );
  });

  it("should create Comment entities correctly", () => {
    // Arrange
    const payloadComment = new Reply({
      id: "comment-123",
      content: "content",
      date: "2021-01-01",
      username: "user-123",
    });
    const payload = {
      id: "comment-123",
      content: "content",
      date: "2021-01-01",
      username: "user-123",
      replies: [payloadComment],
    };

    // Action & Assert
    const comment = new Comment(payload);
    expect(comment.id).toEqual(payload.id);
    expect(comment.content).toEqual(payload.content);
    expect(comment.date).toEqual(payload.date);
    expect(comment.username).toEqual(payload.username);
    expect(comment.replies).toEqual(payload.replies);
  });
});
