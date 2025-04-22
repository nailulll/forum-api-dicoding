const CreateThread = require("../../Domains/threads/entities/CreateThread");

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, userId) {
    const createThread = new CreateThread(useCasePayload);
    return await this._threadRepository.addThread(createThread, userId);
  }
}

module.exports = AddThreadUseCase;
