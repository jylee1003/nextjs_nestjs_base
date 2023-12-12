import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './user.entity';

@Injectable()
export class UserService {
    constructor(private readonly db: PrismaService) {}

    async findUserById(id: number) {
        return await this.db.user.findUnique({
            where: {
                id,
            }
        });
    }

    async findUserByEmail(email: string) {
        return await this.db.user.findUnique({
            where: {
                email,
            }
        });
    }

    async getList() {
        return await this.db.user.findMany();
    }

    async create(data: CreateUserDto) {
        return await this.db.user.create({
            data,
        });
    }

    async update(id: number, data: UpdateUserDto) {
        return await this.db.user.update({
            where: {
                id,
            },
            data,
        });
    }
}
