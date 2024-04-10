import { Body, Controller, Get, Post, Put, Req, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto, OtpDto, SignInDto } from './users/dto/create-user.dto';
import { UsersService } from './users/users.service';
import { AuthService } from './auth/auth.service';

@ApiTags('practice')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private userService: UsersService, private authService: AuthService) { }

  @Post('signup')
  signUp(@Body() body: CreateUserDto) {
    return this.userService.signUp(body);
  }

  @ApiOperation({ summary: 'sign in' })
  @Post('signin')
  signin(@Body() body: SignInDto, @Request() req) {
    return this.authService.signIn(body);
  }

  @ApiOperation({ summary: 'verify email' })
  @ApiResponse({ status: 201, description: 'OK' })
  @ApiConsumes('application/json', 'application/x-www-form-urlencoded')
  @Put('verify-email')
  verifyEmail(@Body() body: OtpDto, @Req() req) {
    return this.authService.verifyEmail(body, req.user)
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
