export class UserDuplicateError extends Error {
    public readonly name = 'UserDuplicateError'

    constructor() {
        super('User duplicate.')
    }
}