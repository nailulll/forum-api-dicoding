const AddedReply = require("../AddedReply");

describe("AddedReply entity", () => {
  it("should throw error when payload does not contain needed property", () => {
    expect(() => new AddedReply({})).toThrowError(
      "REPLY_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload not meet data type specification", () => {
    // Arrange
    const payload = {
      id: "reply-123",
      content: 123,
      owner: "user-123",
    };

    // Action & Assert
    expect(() => new AddedReply(payload)).toThrowError(
      "REPLY_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create AddedReply entities correctly", () => {
    // Arrange
    const payload = {
      id: "reply-123",
      content: "content",
      owner: "user-123",
    };

    // Action & Assert
    const addedReply = new AddedReply(payload);
    expect(addedReply.id).toEqual(payload.id);
    expect(addedReply.content).toEqual(payload.content);
    expect(addedReply.owner).toEqual(payload.owner);
  });
});
