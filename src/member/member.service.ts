import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Member } from './member.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { Band } from 'src/band/band.entity';
import { BandService } from 'src/band/band.service';

@Injectable()
export class MemberService {
    constructor(
        @InjectRepository(Member)
        private readonly memberRepository: Repository<Member>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Band)
        private readonly bandService: BandService
    ) { }

    async delete(id: number, bandId: number, userId: number): Promise<void> {
        // Проверяем, что пользователь является создателем группы
        const band = await this.bandService.getBand(bandId);
        console.log(userId, band.userID);

        if (band.userID != userId) {
            throw new ForbiddenException(`User with id ${userId} cannot delete member with id ${id}`);
        }
        console.log(id);

        // Удаляем участника
        const result = await this.memberRepository.delete({ id });
        if (result.affected === 0) {
            throw new NotFoundException(`Member with id ${id} not found`);
        }
    }

    async getMember(id: number): Promise<Member> {
        const member = await this.memberRepository.createQueryBuilder('member')
            .leftJoinAndSelect('member.band', 'band')
            .where('member.id = :id', { id })
            .getOne();
        if (!member) {
            throw new NotFoundException(`Member with id ${id} not found`);
        }
        return member;
    }
}