import { ApiProperty } from '@nestjs/swagger';

import { IsEmail, IsDefined } from 'class-validator';

export class AuthCredentialDto {
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
