import { Bike } from "../../bike";
import { BikeRepo } from "../../ports/bike-repo";
import prisma from "./db"

export class PrismaBikeRepo implements BikeRepo {
    async find(id: string): Promise<Bike | null> {
        return await prisma.bike.findUnique({
            where: {
                id: id,
            },
        });
    }

    async add(bike: Bike): Promise<string> {
        const newBike = await prisma.bike.create({
            data: bike,
        });
        return newBike.id;
    }

    async remove(id: string): Promise<void> {
        await prisma.bike.delete({
            where: {
                id: id,
            },
        });
    }

    async update(id: string, updatedBike: Bike): Promise<void> {
        await prisma.bike.update({
            where: {
                id: id,
            },
            data: updatedBike,
        });
    }

    async list(): Promise<Bike[]> {
        return await prisma.bike.findMany({});
    }



}