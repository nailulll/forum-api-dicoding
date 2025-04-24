const Reply = require("../Reply");

describe("Reply entity", () => {
  it("should throw error when payload does not contain needed property", () => {
    expect(() => new Reply({})).toThrowError(
      "REPLY.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload not meet data type specification", () => {
    // Arrange
    const payload = {
      id: "reply-123",
      content: 123,
      date: "2021-01-01",
      username: 123,
    };

    // Action & Assert
    expect(() => new Reply(payload)).toThrowError(
      "REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create Reply entities correctly", () => {
    // Arrange
    const payload = {
      id: "reply-123",
      content: "content",
      date: "2021-01-01",
      username: "dicoding",
    };

    // Action & Assert
    const reply = new Reply(payload);
    expect(reply.id).toEqual(payload.id);
    expect(reply.content).toEqual(payload.content);
    expect(reply.date).toEqual(payload.date);
    expect(reply.username).toEqual(payload.username);
    expect(reply).toBeInstanceOf(Reply);
  });

  it("should create Reply entities correctly but reply is deleted", () => {
    // Arrange
    const payload = {
      id: "reply-123",
      content: "content",
      date: "2021-01-01",
      username: "dicoding",
      is_delete: true,
    };

    // Action & Assert
    const reply = new Reply(payload);
    expect(reply.id).toEqual(payload.id);
    expect(reply.content).toEqual("**balasan telah dihapus**");
    expect(reply.date).toEqual(payload.date);
    expect(reply.username).toEqual(payload.username);
    expect(reply).toBeInstanceOf(Reply);
  });
});
