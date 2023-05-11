import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Req, BadRequestException, ForbiddenException } from '@nestjs/common';
import { Band } from './band.entity';
import { BandService } from './band.service';
import { JwtGuard } from 'src/guards/jwt.guard';
import { UserService } from 'src/user/user.service';
import { Request } from 'express';

@Controller('band')
export class BandController {
    constructor(private readonly bandService: BandService, private readonly userService: UserService) { }

    @Get()
    async allBands(): Promise<Band[]> {
        return this.bandService.allBands();
    }

    @UseGuards(JwtGuard)
    @Get('myBand')
    async findAll(@Req() req: Request) {
        const userId = req.cookies.userId;
        const band = await this.bandService.findAll(userId);
        console.log(band);
        return band;
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Band> {
        return this.bandService.findOne(parseInt(id));
    }

    @UseGuards(JwtGuard)
    @Post()
    async create(@Body() band: Band, @Req() req: Request) {
        try {
            const userId = req.cookies.userId;
            const user = await this.userService.findById(userId);
            return await this.bandService.create(user, band);
        } catch (error) {
            console.error(error);
            throw new BadRequestException('Failed to create form');
        }
    }


    @UseGuards(JwtGuard)
    @Put(':id')
    async update(@Param('id') id: string, @Body() form: Band, @Req() req: any) {
        console.log('req.user:', req.user);
        const userId = req.cookies.userId;
        if (!await this.bandService.canEditband(parseInt(userId), parseInt(id))) {
            throw new ForbiddenException(`User with id ${userId} cannot edit form with id ${id}`);
        }
        const updatedForm = await this.bandService.update(parseInt(id), form);
        console.log(updatedForm);
        
        return updatedForm;
    }

    @UseGuards(JwtGuard)
    @Delete(':id')
    async delete(@Param('id') id: string, @Req() req: any): Promise<void> {
        const userId = req.cookies.userId;
        if (!await this.bandService.canEditband(parseInt(userId), parseInt(id))) {
            throw new ForbiddenException(`User with id ${userId} cannot delete form with id ${id}`);
        }
        await this.bandService.delete(parseInt(id));
    }
}