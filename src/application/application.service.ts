import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from './application.entity';
import { User } from 'src/user/user.entity';
import { Band } from 'src/band/band.entity';

@Injectable()
export class ApplicationService {
    constructor(
        @InjectRepository(Application)
        private readonly applicationRepository: Repository<Application>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Band)
        private readonly bandRepository: Repository<Band>,
    ) { }

    async createApplication(userId: number, bandId: number): Promise<Application> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        const band = await this.bandRepository.findOne({ where: { id: bandId } });
        const application = new Application();
        application.user = user;
        application.band = band;
        return this.applicationRepository.save(application);
    }

    async getAllApplications(bandId: number, userId: number): Promise<Application[]> {
        const band = await this.bandRepository.findOne({
            where: {
                id: bandId,
                creatorId: userId,
            },
            relations: ['applications'],
        });

        if (!band) {
            throw new NotFoundException(`Band with id ${bandId} not found`);
        }

        return band.applications.map(application => ({
            id: application.id,
            user: application.user,
            band: application.band,
            status: application.status,
        }));
    }

    async approveApplication(bandId: number, applicationId: number): Promise<Application> {
        const application = await this.applicationRepository
            .createQueryBuilder('application')
            .leftJoinAndSelect('application.band', 'band')
            .where('application.id = :id', { id: applicationId })
            .getOne();
        if (application.band.id !== bandId) {
            throw new Error('Join request does not belong to the specified band.');
        }
        application.status = 'approved';
        return this.applicationRepository.save(application);
    }

    async rejectApplication(bandId: number, applicationId: number): Promise<Application> {
        const application = await this.applicationRepository
            .createQueryBuilder('application')
            .leftJoinAndSelect('application.band', 'band')
            .where('application.id = :id', { id: applicationId })
            .getOne();
        if (application.band.id !== bandId) {
            throw new Error('Join request does not belong to the specified band.');
        }
        application.status = 'rejected';
        return this.applicationRepository.save(application);
    }

    async getApplicationStatus(applicationId: number) {
        const application = await this.applicationRepository.findOne({ where: { id: applicationId } });
        return application.status;
    }

    async isUserAlreadyJoinedBand(userId: number, bandId: number): Promise<boolean> {
        const application = await this.applicationRepository.findOne({
            where: {
                user: { id: userId },
                band: { id: bandId },
                status: 'approved'
            }
        });
        return application !== undefined;
    }

    async canAccessApplications(userId: number, bandId: number): Promise<boolean> {
        const band = await this.bandRepository.findOne({ where: { id: bandId } });
        if (!band) {
            return false;
        }
        console.log("dads", band && band.user && band.userID === userId);

        return band && band.userID === userId;
    }
}