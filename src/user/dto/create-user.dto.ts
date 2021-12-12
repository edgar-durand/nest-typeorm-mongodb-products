import { IsDefined, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class CreateUserDto {
  @IsEmail()
  @ApiProperty({
    description: 'user email',
    example: 'jdoe@example.com',
    maxLength: 80,
  })
  email: string;

  @IsDefined()
  @ApiProperty({ description: 'Password', example: '12345678' })
  password: string;
}
