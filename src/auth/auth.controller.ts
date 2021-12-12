import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthJwt } from './jwt-auth.guard';
import { Auth } from './auth.decorator';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { IResponse } from '../interfaces/api-interfaces';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @Post('login')
  @ApiOperation({
    summary: 'Authentication',
    description:
      'Login to system',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 200, description: 'Success response',
    schema: {
      example: {
        'result': true,
        data: {
          token: 'eyJ0eXAiOiJKV1QiLCJhbGciOi.......',
          profile: {
            email: 'jdoen@example.com',
          },
          errors: [],
          message: 'success',
        },
      },
    },
  })
  login(@Body() credential: AuthCredentialDto): Promise<IResponse> {
    return this.authService.signIn(credential);
  }

  @Post('signup')
  @ApiOperation({
    summary: 'User Register',
    description:
      'signUp into system',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 200, description: 'Success response',
    schema: {
      example: {
        'result': true,
        errors: [],
        data: {},
        message: 'User has been created. Check your email to activate.',
      },
    },
  })
  signUp(@Body() credential: CreateUserDto): Promise<IResponse> {
    return this.authService.signUp(credential);
  }

  @ApiOperation({
    summary: 'Sign out',
    description:
      'Log out user from system',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 200, description: 'Success response',
    schema: {
      example: {
        result: true,
        data: {},
        message: 'success',
        errors: [],
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(AuthJwt)
  @Get('signout')
  signOut(@Request() { userId }): Promise<IResponse> {
    return this.authService.signOut(userId);
  }

}
