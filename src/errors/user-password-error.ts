export class UserPasswordError extends Error {
    public readonly name = 'UserPasswordError'

    constructor() {
        super('User password error.')
    }
}