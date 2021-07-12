import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { RegisterDTO } from './dtos/register.dto';
import { IRequestWithUser } from './interface/requestWithUser.interface';
import { LocalAuthenticationGuard } from './localAuthenticationGuard.guard';
import { Response } from 'express';
import JwtAuthenticationGuard from './jwt-authentication.guard';

@Controller('authentication')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({
  strategy: 'excludeAll',
})
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request: IRequestWithUser) {
    const user = request.user;
    return user;
  }

  @HttpCode(201)
  @Post('register')
  async register(@Body() registrationData: RegisterDTO) {
    const result = await this.authenticationService.register(registrationData);
    return result;
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  async logIn(@Req() request: IRequestWithUser, @Res() response: Response) {
    const { user } = request;
    const token = this.authenticationService.getJwtToken(user.id);
    user.password = undefined;
    return response.send({ user, token });
  }
}
