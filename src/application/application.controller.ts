import { Controller, Post, UseGuards, Body, Param, Get, Patch, Req, Query, ForbiddenException, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { JwtGuard } from 'src/guards/jwt.guard';
import { ApplicationService } from './application.service';
import { Request } from 'express';
import { Application } from './application.entity';

@Controller('applications')


@UseGuards(JwtGuard)
export class ApplicationController {
    constructor(private readonly applicationService: ApplicationService) { }

    @Post(':bandId/join')
    async createApplication(@Req() req, @Param('bandId') bandId: number, @Body() body: { role: string }) {
        const user = req.cookies.userId;
        const application = await this.applicationService.createApplication(user, bandId, body.role);
        return application;
    }


    @Get(':bandId')
    async getAllApplications(@Req() req: Request, @Param('bandId') bandId: string): Promise<Application[]> {
        const userId = parseInt(req.cookies.userId);
        console.log(`userId: ${userId}, bandId: ${bandId}`);
        if (!await this.applicationService.canAccessApplications(userId, parseInt(bandId))) {
            throw new ForbiddenException(`User with id ${userId} cannot do smth with band with id ${bandId}`);
        }
        const applications = await this.applicationService.getAllApplications(parseInt(bandId), userId);
        console.log(`applications: ${JSON.stringify(applications)}`);
        return applications;
    }




    @Patch(':applicationId/approve')
    async approveApplication(@Param('applicationId') applicationId: number, @Body() body: { role: string }, @Req() req: Request) {
        const user = req.cookies.user;
        console.log("req.cookies.user:", user);
        console.log("con: ", user.bandId, applicationId, body.role, body);

        const result = await this.applicationService.approveApplication(user.bandId, applicationId, body.role);
        return { message: 'Join request approved successfully', data: result };
    }

    @Patch(':applicationId/reject')
    async rejectApplication(@Param('applicationId') applicationId: number, @Body() body: { role: string }, @Req() req: Request) {
        const user = req.cookies.user;
        console.log(user);

        if (!user || user.bandId === undefined) {
            throw new HttpException('User not authenticated or missing band ID', HttpStatus.UNAUTHORIZED);
        }
        const result = await this.applicationService.rejectApplication(user.bandId, applicationId, body.role);
        console.log(result);

        return { message: 'Join request rejected successfully', data: result };
    }

    @Get(':applicationId/status')
    async getApplicationStatus(@Param('applicationId') applicationId: number) {
        const result = await this.applicationService.getApplicationStatus(applicationId);
        return { message: 'Join request status retrieved successfully', data: result };
    }

    @Get(':bandId/users/:userId')
    async isUserAlreadyJoinedBand(@Param('userId') userId: number, @Param('bandId') bandId: number) {
        const result = await this.applicationService.isUserAlreadyJoinedBand(userId, bandId);
        return { message: 'User join status retrieved successfully', data: result };
    }
}