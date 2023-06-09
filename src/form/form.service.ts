import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Form } from './form.entity';
import { User } from 'src/user/user.entity';

@Injectable()
export class FormService {
    constructor(
        @InjectRepository(Form)
        private readonly formRepository: Repository<Form>,
    ) { }


    async allForms(): Promise<Form[]> {
        return await this.formRepository.find();
    }


    async findAll(userId: number): Promise<Form[]> {
        console.log(userId)
        const forms = await this.formRepository.find({ where: { userID: userId } });
        console.log(userId)
        console.log(forms)
        return forms;
    }

    async findOne(id: number): Promise<Form> {
        const form = await this.formRepository.findOne({ where: { id: id } });
        return form;
    }

    async create(user: User, form: Form): Promise<Form> {
        const newForm = new Form();
        newForm.user = user;
        newForm.userID = user.id;
        newForm.userName = form.userName;
        newForm.age = form.age;
        newForm.city = form.city;
        newForm.gender = form.gender;
        newForm.musicalInstrument = form.musicalInstrument;
        newForm.description = form.description;
        newForm.communication = form.communication;
        console.log(newForm);

        const result = await this.formRepository
            .createQueryBuilder()
            .insert()
            .into(Form)
            .values(newForm)
            .execute();

        return { ...newForm, id: result.identifiers[0].id };
    }



    async update(id: number, form: Form): Promise<Form> {
        await this.formRepository.update(id, form);
        return await this.formRepository.findOne({ where: { id } });
    }

    async delete(id: number): Promise<void> {
        await this.formRepository.delete(id);
    }

    async canEditForm(userId: number, formId: number): Promise<boolean> {
        const form = await this.formRepository.findOne({ where: { id: formId } });
        return form && form.userID === userId;
    }
}