import { Request } from 'express';
import { User } from 'src/user/user.entity';

declare module 'express' {
    export interface Request {
        user: User;
    }
}