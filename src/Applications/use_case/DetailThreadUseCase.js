class DetailThreadUseCase {
    constructor({threadRepository}) {
        this._threadRepository = threadRepository;
    }

    async execute(threadId) {
        return await this._threadRepository.detailThread(threadId);
    }
}

module.exports = DetailThreadUseCase;