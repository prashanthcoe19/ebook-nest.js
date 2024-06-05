import {
  Injectable,
  Inject,
  HttpStatus,
  Req,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from '../users/dto/user.dto';
import { UsersService } from '../users/users.service';
import { AuthDto } from './dto/auth.dto';
import { ForbiddenException } from '../../core/exception/forbidden-exception';
import { CustomHttpException } from '../../core/exception/custom-excpetion';
import { User } from '../users/user.entity';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { UserSerializer } from '../users/user.serializer';
import * as crypto from 'crypto';
import { RefreshToken } from './refresh-token.entity';
import { TokenExpiredError } from 'jsonwebtoken';
import { ExceptionTitleList } from '../../core/constants/expection-title-list';
import moment from 'moment';
import { MailJobInterface } from '../mail/interface/mail-job.interface';
import { MailService } from '../mail/mail.service';
import {
  RateLimiterRes,
  RateLimiterStoreAbstract,
} from 'rate-limiter-flexible';
import config from 'config';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Op } from 'sequelize';

const throttleConfig = config.get('throttle.login');
const jwtConfig = config.get('jwt');
console.log(jwtConfig);
@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: typeof User,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    @Inject('LOGIN_THROTTLE')
    private readonly rateLimiter: RateLimiterStoreAbstract,

    @Inject('FORGOT_PASSWORD_THROTTLE')
    private readonly forgotPasswordRateLimiter: RateLimiterStoreAbstract,
  ) {}

  async validateUser(username: string, pass: string) {
    // find if user exist with this email
    const user = await this.userService.findOneByEmail(username);

    if (user && (await this.comparePassword(pass, user.password))) {
      const { password, ...result } = user['dataValues'];
      return result;
    }
    return null;
  }

  public async login(user: AuthDto, @Req() req: Request): Promise<string[]> {
    // console.log(user);

    const usernameIPkey = `${user.email}_${req.ip}`;

    const resUsernameAndIP = await this.rateLimiter.get(usernameIPkey);

    let retrySecs = 0;
    if (
      resUsernameAndIP !== null &&
      resUsernameAndIP.consumedPoints > throttleConfig.limit
    ) {
      retrySecs = Math.round(resUsernameAndIP.msBeforeNext / 1000) || 1;
    }
    // console.log(retrySecs);
    if (retrySecs > 0) {
      throw new CustomHttpException(
        `tooManyRequest-{"second":"${String(retrySecs)}"}`,
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    let existingUser = await this.validateUser(user.email, user.password);
    if (!existingUser) {
      const [result, throttleError] =
        await this.limitConsumerPromiseHandler(usernameIPkey);
      // console.log(result);
      if (!result) {
        // console.log('here2');
        throw new CustomHttpException(
          `tooManyRequest-{"second":${String(
            Math.round(throttleError.msBeforeNext / 1000) || 1,
          )}}`,
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
      // throw new UnauthorizedException('Invalid Credentials', 422);
      throw new ForbiddenException('Invalid Credentials', 422);
    }
    const { id, email } = existingUser;
    const access_token = await this.generateToken({ id, email });

    const refresh_token = await this.createRefreshToken(id);

    await this.rateLimiter.delete(usernameIPkey);
    const responsePayload = this.buildResponsePaylod(
      access_token,
      refresh_token,
    );

    return responsePayload;
  }

  async limitConsumerPromiseHandler(
    usernameIPkey: string,
    providedRateLimiter = this.rateLimiter,
  ): Promise<[RateLimiterRes, RateLimiterRes]> {
    return new Promise((resolve) => {
      providedRateLimiter
        .consume(usernameIPkey)
        .then((rateLimiterRes) => {
          resolve([rateLimiterRes, null]);
        })
        .catch((rateLimiterError) => {
          resolve([null, rateLimiterError]);
        });
    });
  }

  public async create(user: UserDto): Promise<UserSerializer> {
    const pass = await this.hashPassword(user.password);
    // create the user
    const token = crypto.randomBytes(20).toString('hex');
    const token_expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const newUser = await this.userRepository.create({
      ...user,
      password: pass,
      token,
      token_expires,
    });
    // const newUser = await this.userService.create({ ...user, password: pass ,});

    return plainToClass(
      UserSerializer,
      instanceToPlain(newUser['dataValues'], {}),
    );
  }

  get(user: User): UserSerializer {
    return plainToClass(UserSerializer, instanceToPlain(user, {}));
  }

  async forgetPassword(forgetPasswordDto: ForgetPasswordDto) {
    try {
      const { email } = forgetPasswordDto;

      const [result, throttleError] = await this.limitConsumerPromiseHandler(
        email,
        this.forgotPasswordRateLimiter,
      );
      if (!result) {
        throw new CustomHttpException(
          `resendEmail-{"second":${String(
            Math.ceil(throttleError.msBeforeNext / 1000),
          )}}`,
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      const user = await this.userRepository.findOne({
        where: {
          email,
        },
      });

      if (!user) {
        throw new NotFoundException('User Not Found');
      }

      const token = this.generateUniqueToken();
      user.token = token;
      const currentDateTime = new Date();
      const tokenExpires = new Date(
        currentDateTime.getTime() + 24 * 60 * 60 * 1000,
      );
      user.token_expires = tokenExpires;
      await user.save();

      await this.sendMailToUser(
        user,
        'Password Reset',
        `auth/reset-password/${token}`,
        'Reset Your Password',
      );
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    try {
      const { token, password } = resetPasswordDto;
      const user = await this.userRepository.findOne({
        where: {
          token: token,
          token_expires: { [Op.gt]: new Date() },
        },
      });
      if (!user) {
        throw new NotFoundException('invalid Reset password link');
      }

      user.token = null;
      const hashedPassword = await this.hashPassword(password);
      user.password = hashedPassword;
      await user.save();
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async sendMailToUser(
    user: UserSerializer,
    subject: string,
    url: string,
    linkLabel: string,
  ) {
    const mailData: MailJobInterface = {
      to: user.email,
      subject,
      context: {
        email: user.email,
        link: url,
        subject,
        linkLabel,
      },
    };
    await this.mailService.sendMail(mailData, 'system-mail');
  }

  async generateToken(user: object): Promise<string> {
    return await this.jwtService.signAsync(user);
  }

  buildResponsePaylod(access_token: string, refresh_token?: string): string[] {
    const isSameSite = false; // Set your SameSite preference here
    let tokenCookies = [
      `Authentication=${access_token}; HttpOnly; Path=/; ${
        !isSameSite ? 'SameSite=None; Secure;' : ''
      } Max-Age=${jwtConfig.cookieExpiresIn}`,
    ];
    if (refresh_token) {
      const expiration = new Date();
      expiration.setSeconds(expiration.getSeconds() + jwtConfig.expiresIn);
      tokenCookies = tokenCookies.concat([
        `Refresh=${refresh_token}; HttpOnly; Path=/; ${
          !isSameSite ? 'SameSite=None; Secure;' : ''
        } Max-Age=${jwtConfig.cookieExpiresIn}`,
        `ExpiresIn=${expiration}; Path=/; ${
          !isSameSite ? 'SameSite=None; Secure;' : ''
        } Max-Age=${jwtConfig.cookieExpiresIn}`,
      ]);
    }
    return tokenCookies;
  }

  async createRefreshToken(userId: number): Promise<string> {
    const token = new RefreshToken({
      expiresAt: moment().add(10, 'minutes').toDate(),
      userId: userId,
    });

    const savedToken = await token.save();

    const opts = {
      subject: String(userId),
      jwtid: String(savedToken.id),
    };

    const refresh_token = await this.jwtService.signAsync(
      { ...opts },
      {
        expiresIn: jwtConfig.refreshExpiresIn,
      },
    );

    return refresh_token;
  }

  async generateAccessFromRefreshToken(refreshToken: string) {
    try {
      const payload = await this.resolveRefreshToken(refreshToken);

      const token = await RefreshToken.findByPk(payload['dataValues'].id);

      if (!token) {
        throw new Error('Token not found');
      }

      if (token.isRevoked) {
        throw new ForbiddenException('tokenExpired', 403);
      }

      const user = await User.findByPk(payload['dataValues'].userId);
      const { id, email } = user['dataValues'];
      const access_token = await this.generateToken({ id, email });
      return this.buildResponsePaylod(access_token, refreshToken);
    } catch (err) {
      throw err;
    }
  }

  async resolveRefreshToken(refresh: string): Promise<RefreshToken> {
    try {
      const payload = await this.jwtService.verifyAsync(refresh);
      const token = payload.jwtid;
      const refreshToken = await RefreshToken.findOne({ where: { id: token } });
      return refreshToken;
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        console.log('instanceoF');
        throw new CustomHttpException(
          ExceptionTitleList.RefreshTokenExpired,
          HttpStatus.BAD_REQUEST,
          400,
        );
      } else {
        console.log('not instace');
        throw new CustomHttpException(
          ExceptionTitleList.InvalidRefreshToken,
          HttpStatus.BAD_REQUEST,
          400,
        );
      }
    }
  }

  async hashPassword(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  async comparePassword(
    enteredPassword: string,
    dbPassword: string,
  ): Promise<boolean> {
    const match = await bcrypt.compare(enteredPassword, dbPassword);
    return match;
  }

  generateUniqueToken(): string {
    const timeStamp = new Date().getTime().toString();
    const randomBytes = Math.random().toString(36).substring(2, 10);
    const tokenData = randomBytes + timeStamp;

    return tokenData;
  }
}
