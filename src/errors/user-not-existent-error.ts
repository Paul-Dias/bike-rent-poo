export class UserNotExistentError extends Error {
    public readonly name = 'UserNotExistentError'

    constructor() {
        super('User does not existent.')
    }
}