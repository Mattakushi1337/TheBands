import { Injectable } from '@nestjs/common';
import { Band } from './band.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';

@Injectable()
export class BandService {
    constructor(
        @InjectRepository(Band)
        private readonly bandRepository: Repository<Band>,
    ) { }

    async allBands(): Promise<Band[]> {
        return await this.bandRepository.find();
    }


    async findAll(userId: number): Promise<Band[]> {
        console.log(userId)
        const bands = await this.bandRepository.find({ where: { userID: userId } });
        console.log(userId)
        console.log(bands)
        return bands;
    }

    async findOne(id: number): Promise<Band> {
        const form = await this.bandRepository.findOne({ where: { id: id } });
        return form;
    }

    async create(user: User, band: Band): Promise<Band> {
        const newBand = new Band();
        newBand.user = user;
        newBand.userID = user.id;
        newBand.creatorId = user.id;
        newBand.bandName = band.bandName;
        newBand.description = band.description;
        newBand.contact = band.contact;
        console.log(newBand);

        const result = await this.bandRepository
            .createQueryBuilder()
            .insert()
            .into(Band)
            .values(newBand)
            .execute();

        return { ...newBand, id: result.identifiers[0].id };
    }

    async update(id: number, form: Band): Promise<Band> {
        await this.bandRepository.update(id, form);
        console.log("ddd", await this.bandRepository.update(id, form), "aaa", await this.bandRepository.findOne({ where: { id } }));

        return await this.bandRepository.findOne({ where: { id } });
    }

    async delete(id: number): Promise<void> {
        await this.bandRepository.delete(id);
    }

    async canEditband(userId: number, bandId: number): Promise<boolean> {
        const band = await this.bandRepository.findOne({ where: { id: bandId } });
        return band && band.userID === userId;
    }

    async getBand(id: number): Promise<Band> {
        return this.bandRepository.findOne({ where: { id } });
    }
}


