import { Controller, Get, Post, Put, Delete, Body, Param, Req, BadRequestException, UseGuards } from '@nestjs/common';
import { FormService } from './form.service';
import { Form } from './form.entity';
import { UserService } from 'src/user/user.service';
import { CookieOptions, Request } from 'express';
import { JwtGuard } from 'src/guards/jwt.guard';
@Controller('form')
export class FormController {
    constructor(private readonly formService: FormService, private readonly userService: UserService) { }
    
    @Get()
    async findAll(): Promise<Form[]> {
        return this.formService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Form> {
        return this.formService.findOne(parseInt(id));
    }


    @UseGuards(JwtGuard)
    @Post()
    async create(@Body() form: Form, @Req() req: Request) {
        try {
            const userId = req.cookies.userId;
            const user = await this.userService.findById(userId);
            return await this.formService.create(req.user, form);
        } catch (error) {
            console.error(error);
            throw new BadRequestException('Failed to create form');
        }
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() form: Form): Promise<void> {
        await this.formService.update(parseInt(id), form);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        await this.formService.delete(parseInt(id));
    }
}