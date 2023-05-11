import { Controller, Get, Post, Put, Delete, Body, Param, Req, BadRequestException, UseGuards, ForbiddenException } from '@nestjs/common';
import { FormService } from './form.service';
import { Form } from './form.entity';
import { UserService } from 'src/user/user.service';
import { Request } from 'express';
import { JwtGuard } from 'src/guards/jwt.guard';
@Controller('form')
export class FormController {
    constructor(private readonly formService: FormService, private readonly userService: UserService) { }

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
            return await this.formService.create(user, form);
        } catch (error) {
            console.error(error);
            throw new BadRequestException('Failed to create form');
        }
    }

    @UseGuards(JwtGuard)
    @Put(':id')
    async update(@Param('id') id: string, @Body() form: Form, @Req() req: Request) {
        console.log('req.user:', req.user);
        const userId = req.cookies.userId;
        if (!await this.formService.canEditForm(parseInt(userId), parseInt(id))) {
            throw new ForbiddenException(`User with id ${userId} cannot edit form with id ${id}`);
        }
        const updatedForm = await this.formService.update(parseInt(id), form);
        console.log(updatedForm);
        
        return updatedForm;
    }



    @UseGuards(JwtGuard)
    @Get('form/myForm')
    async findAll(@Req() req: Request) {
        const userId = req.cookies.userId;
        const forms = await this.formService.findAll(userId);
        console.log(forms);
        return forms;
    }

    @Get('form/all')
    async allForms(): Promise<Form[]> {
        console.log(await this.formService.allForms());

        return await this.formService.allForms();
    }

    @UseGuards(JwtGuard)
    @Delete(':id')
    async delete(@Param('id') id: string, @Req() req: any): Promise<void> {
        const userId = req.cookies.userId;
        if (!await this.formService.canEditForm(parseInt(userId), parseInt(id))) {
            throw new ForbiddenException(`User with id ${userId} cannot delete form with id ${id}`);
        }
        await this.formService.delete(parseInt(id));
    }
}