import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({description: '이메일', required: true})
    email: string;
    @ApiProperty({description: '이름', required: true})
    name: string;
    @ApiProperty({description: '암호', required: true})
    password: string;
}

export class UpdateUserDto {
    @ApiProperty({description: '이메일', required: false})
    email?: string;
    @ApiProperty({description: '이름', required: false})
    name?: string;
}