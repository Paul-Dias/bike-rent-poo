import sinon from "sinon"
import { App } from "./app"
import { Bike } from "./bike"
import { User } from "./user"
import { Location } from "./location"
import { BikeNotFoundError } from "./errors/bike-not-found-error"
import { UnavailableBikeError } from "./errors/unavailable-bike-error"
import { UserNotFoundError } from "./errors/user-not-found-error"
import { UserDuplicateError } from "./errors/user-duplicate-error"
import { UserNotExistentError } from "./errors/user-not-existent-error"
import { UserPasswordError } from "./errors/user-password-error"

describe('App', () => {
    it('should correctly calculate the rent amount', async () => {
        const app = new App()
        const user = new User('Jose', 'jose@mail.com', '1234')
        await app.registerUser(user)
        const bike = new Bike('caloi mountainbike', 'mountain bike',
            1234, 1234, 100.0, 'My bike', 5, [])
        app.registerBike(bike)
        const clock = sinon.useFakeTimers();
        app.rentBike(bike.id, user.email)
        const hour = 1000 * 60 * 60
        clock.tick(2 * hour)
        const rentAmount = app.returnBike(bike.id, user.email)
        expect(rentAmount).toEqual(200.0)
    })

    it('should be able to move a bike to a specific location', () => {
        const app = new App()
        const bike = new Bike('caloi mountainbike', 'mountain bike',
            1234, 1234, 100.0, 'My bike', 5, [])
        app.registerBike(bike)
        const newYork = new Location(40.753056, -73.983056)
        app.moveBikeTo(bike.id, newYork)
        expect(bike.location.latitude).toEqual(newYork.latitude)
        expect(bike.location.longitude).toEqual(newYork.longitude)
    })

    it('should throw an exception when trying to move an unregistered bike', () => {
        const app = new App()
        const newYork = new Location(40.753056, -73.983056)
        expect(() => {
            app.moveBikeTo('fake-id', newYork)
        }).toThrow(BikeNotFoundError)
    })

    it('should correctly handle a bike rent', async () => {
        const app = new App()
        const user = new User('Jose', 'jose@mail.com', '1234')
        await app.registerUser(user)
        const bike = new Bike('caloi mountainbike', 'mountain bike',
            1234, 1234, 100.0, 'My bike', 5, [])
        app.registerBike(bike)
        app.rentBike(bike.id, user.email)
        expect(app.rents.length).toEqual(1)
        expect(app.rents[0].bike.id).toEqual(bike.id)
        expect(app.rents[0].user.email).toEqual(user.email)
        expect(bike.available).toBeFalsy()
    })

    it('should throw unavailable bike when trying to rent with an unavailable bike', async () => {
        const app = new App()
        const user = new User('Jose', 'jose@mail.com', '1234')
        await app.registerUser(user)
        const bike = new Bike('caloi mountainbike', 'mountain bike',
            1234, 1234, 100.0, 'My bike', 5, [])
        app.registerBike(bike)
        app.rentBike(bike.id, user.email)
        expect(() => {
            app.rentBike(bike.id, user.email)
        }).toThrow(UnavailableBikeError)
    })

    it('should throw user not found error when user is not found', () => {
        const app = new App()
        expect(() => {
            app.findUser('fake@mail.com')
        }).toThrow(UserNotFoundError)
    })

    it('should throw an exception when registering a duplicate user', async () => {
        const app = new App();
        const user = new User('Jose', 'jose@mail.com', '1234');
        await app.registerUser(user);

        const duplicateUser = new User('Duplicate', 'jose@mail.com', '5678');
        await expect(app.registerUser(duplicateUser)).rejects.toThrow(UserDuplicateError);
    });

    it('should throw an exception when authenticating with a non-existing user', async () => {
        const app = new App();
        const user = new User('Joseh', 'jose@mail.com', '1234');
        await app.registerUser(user);

        await expect(app.authenticate('nonexisting@mail.com', 'password')).rejects.toThrow(UserNotFoundError);
    });

    it('should throw an exception when authenticating with incorrect password', async () => {
        const app = new App();
        const user = new User('Jose', 'jose@mail.com', '1234');
        await app.registerUser(user);

        await expect(app.authenticate(user.email, 'incorrectpassword')).rejects.toThrow(UserPasswordError);
    });

    it('should remove a user', async () => {
        const app = new App();
        const user = new User('Joseh', 'joseh@mail.com', '1234');
        await app.registerUser(user);

        app.removeUser("joeh@mail.com");
        expect(() => { app.findUser(user.email) }).toThrow(UserNotFoundError)

    });


    it('should throw an exception when trying to remove a non-existing user', () => {
        const app = new App();
        const email = 'nonexisting@mail.com';
        expect(() => { app.removeUser(email) }).toThrow(UserNotExistentError);
    });
});

