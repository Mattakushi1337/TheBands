import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from './application.entity';
import { User } from 'src/user/user.entity';
import { Band } from 'src/band/band.entity';
import { Member } from 'src/member/member.entity';
import { Request } from 'express';

@Injectable()
export class ApplicationService {
    constructor(
        @InjectRepository(Application)
        private readonly applicationRepository: Repository<Application>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Band)
        private readonly bandRepository: Repository<Band>,
        @InjectRepository(Member)
        private readonly memberRepository: Repository<Member>
    ) { }

    async createApplication(userId: number, bandId: number, role: string): Promise<Application> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        const band = await this.bandRepository.findOne({ where: { id: bandId } });
        const application = new Application();
        application.user = user;
        application.band = band;
        application.role = role;
        return this.applicationRepository.save(application);
    }

    async getAllApplications(bandId: number, userId: number): Promise<Application[]> {
        const band = await this.bandRepository.findOne({
            where: {
                id: bandId,
                creatorId: userId,
            },
            relations: ['applications', 'applications.user'],
        });

        if (!band) {
            throw new NotFoundException(`Band with id ${bandId} not found`);
        }

        return band.applications.map(application => ({
            id: application.id,
            user: application.user,
            userName: application.user.userName,
            band: application.band,
            status: application.status,
            role: application.role
        }));
    }


    async approveApplication(bandId: number, applicationId: number, role: string): Promise<Member> {
        const application = await this.applicationRepository
            .createQueryBuilder('application')
            .leftJoinAndSelect('application.band', 'band')
            .leftJoinAndSelect('application.user', 'user')
            .where('application.id = :id', { id: applicationId })
            .getOne();

        if (!application) {
            throw new Error('Join request not found.');
        }
        console.log(application.band.id, bandId);

        if (!application.band || application.band.id !== bandId) {
            throw new Error('Join request does not belong to the specified band.');
        }

        // Изменяем статус заявки на "approved" и сохраняем ее
        application.status = 'approved';
        application.role = role;

        const savedApplication = await this.applicationRepository.save(application);

        if (!savedApplication.user || !savedApplication.band) {
            throw new Error('Invalid application data');
        }

        // Создаем объект Member на основе данных из заявки
        const member = new Member();
        member.role = role; // сохраняем значение роли из заявки
        member.user = savedApplication.user;
        member.band = savedApplication.band;
        console.log("member: ", member);
        console.log("application: ", application);

        const savedMember = await this.memberRepository.save(member);
        await this.applicationRepository.delete(applicationId);
        return savedMember;
    }

    async rejectApplication(bandId: number, applicationId: number, role: string): Promise<Application> {
        const application = await this.applicationRepository
            .createQueryBuilder('application')
            .leftJoinAndSelect('application.band', 'band')
            .where('application.id = :id', { id: applicationId })
            .getOne();
        if (!application.band || application.band.id !== bandId) {
            throw new Error('Join request does not belong to the specified band.');
        }
        application.status = 'rejected';
        application.role = role;
        return this.applicationRepository.remove(application);
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