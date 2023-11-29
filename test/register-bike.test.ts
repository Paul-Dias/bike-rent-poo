import request from 'supertest';
import server from '../src/server';
import prisma from '../src/external/database/db';

describe('Register bike route', () => {
    beforeEach(async () => {
        await prisma.bike.deleteMany({});
    });

    afterAll(async () => {
        await prisma.bike.deleteMany({});
    });

    it('registers a bike with valid data', async () => {
        await request(server)
            .post('/api/bikes')
            .send({
                name: 'Mountain Bike',
                type: 'Mountain',
                bodySize: 18,
                maxLoad: 150,
                rate: 25,
                description: 'Super mountain bike',
                ratings: 4.5,
                imageUrls: ['url1', 'url2'],
                available: true,
                location: {
                    latitude: 40.7128,
                    longitude: -74.0060,
                },
            })
            .expect(201)
            .then((res) => {
                expect(res.body.id).toBeDefined();
            });
    });

    it('returns 500 when trying to register a bike with invalid data', async () => {
        await request(server)
            .post('/api/bikes')
            .send({
                // Invalid data, missing required fields
                type: 'Mountain',
                maxLoad: 150,
                rate: 25,
                description: 'Super mountain bike',
                ratings: 4.5,
                imageUrls: ['url1', 'url2'],
                available: true,
                location: {
                    latitude: 40.7128,
                    longitude: -74.0060,
                },
            })
            .expect(500);
    });
});
