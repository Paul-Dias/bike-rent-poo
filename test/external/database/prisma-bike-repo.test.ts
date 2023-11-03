import { PrismaBikeRepo } from "../../../src/external/database/prisma-bike-repo";
import { Bike } from "../../../src/bike";
import prisma from "../../../src/external/database/db";

describe('PrismaBikeRepo', () => {
    beforeEach(async () => {
        await prisma.bike.deleteMany({});
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('adds a bike in the database', async () => {
        const bikeToBePersisted = new Bike(
            'test bike',
            'mountain',
            26,
            150,
            500,
            'Test bike description',
            0,
            ['url1', 'url2']
        );

        const repo = new PrismaBikeRepo();
        const bikeId = await repo.add(bikeToBePersisted);
        expect(bikeId).toBeDefined();

        const persistedBike = await repo.find(bikeId);
        expect(persistedBike.name).toEqual(bikeToBePersisted.name);
    });

    it('removes a bike from the database', async () => {
        const bikeToBePersisted = new Bike(
            'test bike',
            'mountain',
            26,
            150,
            500,
            'Test bike description',
            0,
            ['url1', 'url2']
        );

        const repo = new PrismaBikeRepo();
        const bikeId = await repo.add(bikeToBePersisted);
        await repo.remove(bikeId);

        const removedBike = await repo.find(bikeId);
        expect(removedBike).toBeNull();
    });

    it('lists bikes in the database', async () => {
        const bike1 = new Bike('bike1', 'road', 28, 120, 400, 'Bike 1 description', 0, ['url1']);
        const bike2 = new Bike('bike2', 'mountain', 26, 150, 500, 'Bike 2 description', 0, ['url2']);

        const repo = new PrismaBikeRepo();
        await repo.add(bike1);
        await repo.add(bike2);

        const bikeList = await repo.list();
        expect(bikeList.length).toEqual(2);
    });
});
