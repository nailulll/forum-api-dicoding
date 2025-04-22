const CreateComment = require("../CreateComment");

describe("CreateComment entity", () => {
  it("should throw error when payload does not contain needed property", () => {
    // Arrange
    const payload = {};

    // Action & Assert
    expect(() => new CreateComment(payload)).toThrowError(
      "CREATE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload not meet data type specification", () => {
    // Arrange
    const payload = {
      content: 123,
    };

    // Action & Assert
    expect(() => new CreateComment(payload)).toThrowError(
      "CREATE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create CreateComment entities correctly", () => {
    // Arrange
    const payload = {
      content: "content",
    };

    // Action & Assert
    const addComment = new CreateComment(payload);
    expect(addComment.content).toEqual(payload.content);
  });
});
