class ThreadRepository {
    async addThread(thread, userId) {
        throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async findThreadById(threadId) {
        throw new Error("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    }

    async detailThread(threadId) {
        throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }
}

module.exports = ThreadRepository;