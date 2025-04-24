const CreatedComment = require("../CreatedComment");
describe("CreatedComment entity", () => {
  it("should throw error when payload does not contain needed property", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      content: "content",
    };

    // Action & Assert
    expect(() => new CreatedComment(payload)).toThrowError(
      "CREATED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload not meet data type specification", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      content: 123,
      username: "user-123",
    };

    // Action & Assert
    expect(() => new CreatedComment(payload)).toThrowError(
      "CREATED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create CreatedComment entities correctly", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      content: "content",
      username: "user-123",
    };

    // Action & Assert
    const createdComment = new CreatedComment(payload);
    expect(createdComment.id).toEqual(payload.id);
    expect(createdComment.content).toEqual(payload.content);
    expect(createdComment.username).toEqual(payload.username);
  });
});
