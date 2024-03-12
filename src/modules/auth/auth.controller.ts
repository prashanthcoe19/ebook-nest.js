import {
  Controller,
  Body,
  Post,
  Get,
  UseGuards,
  Req,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { UserDto } from '../users/dto/user.dto';
import { DoesUserExist } from '../../core/guards/doesUserExist.guard';
import { User } from '../users/user.entity';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { UserSerializer } from '../users/user.serializer';
import { GetUser } from '../../core/decorator/get-user.decorator';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Req() req: Request,
    @Res() res: Response,
    @Body() authDto: AuthDto,
  ) {
    const cookiePayload = await this.authService.login(authDto);
    res.setHeader('Set-Cookie', cookiePayload);
    return res.status(HttpStatus.NO_CONTENT).json({});
  }

  @UseGuards(DoesUserExist)
  @Post('signup')
  signUp(@Body() user: UserDto): Promise<UserSerializer> {
    return this.authService.create(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@GetUser() user: User): UserSerializer {
    return this.authService.get(user);
  }

  @Get('mail-test')
  @UseGuards(JwtAuthGuard)
  async emailTest(@GetUser() user: User) {
    const userToSend = this.authService.get(user);
    const subject = 'test';
    await this.authService.sendMailToUser(userToSend, subject);
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    try {
      const cookiePayload =
        await this.authService.generateAccessFromRefreshToken(
          req.cookies['Refresh'],
        );
      res.setHeader('Set-Cookie', cookiePayload);
      return res.status(HttpStatus.NO_CONTENT).json({});
    } catch (err) {
      console.log(err);
      return res.sendStatus(HttpStatus.BAD_REQUEST);
    }
  }
}
