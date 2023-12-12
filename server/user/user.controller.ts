import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { User } from "@prisma/client";
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './user.entity';
import bcrypt from 'bcrypt';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller('api/user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiOperation({ summary: '사용자 조회' })
    @Get("/:id")
    async findUserById(@Param("id", ParseIntPipe) id: number): Promise<User | null> {
        return await this.userService.findUserById(id);
    }

    @ApiOperation({ summary: '사용자 이메일로 조회' })
    @Get("/email/:email")
    async findUserByEmail(@Param("email") email: string): Promise<User | null> {
        return await this.userService.findUserByEmail(email);
    }

    @ApiOperation({ summary: '사용자 목록 조회' })
    @Get("/")
    async getList(): Promise<User[]> {
        return await this.userService.getList();
    }

    @ApiOperation({ summary: '사용자 생성' })
    @Post("/create")
    async create(@Body() createUserDto: CreateUserDto): Promise<User> {
        const hash = await bcrypt.hash(createUserDto.password, 10)
        return await this.userService.create({
            email: createUserDto.email,
            name: createUserDto.name,
            password: hash
        });
    }

    @ApiOperation({ summary: '사용자 수정' })
    @Post("/update/:id")
    async update(@Param("id", ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto): Promise<User> {
        return await this.userService.update(id, {
            email: updateUserDto.email,
            name: updateUserDto.name
        });
    }

}
