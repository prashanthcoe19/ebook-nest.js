import { Injectable, Inject, HttpStatus } from '@nestjs/common';
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

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: typeof User,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
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

  public async login(user: AuthDto): Promise<string[]> {
    let existingUser = await this.validateUser(user.email, user.password);
    if (!existingUser) {
      throw new ForbiddenException('Invalid Credentials', 422);
    }
    const { id, email } = existingUser;
    const access_token = await this.generateToken({ id, email });

    const refresh_token = await this.createRefreshToken(id);

    const responsePayload = this.buildResponsePaylod(
      access_token,
      refresh_token,
    );

    return responsePayload;
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

  async generateToken(user: object): Promise<string> {
    return await this.jwtService.signAsync(user);
  }

  buildResponsePaylod(access_token: string, refresh_token?: string): string[] {
    const isSameSite = true; // Set your SameSite preference here
    let tokenCookies = [
      `Authentication=${access_token}; HttpOnly; Path=/; ${
        !isSameSite ? 'SameSite=None; Secure;' : ''
      } Max-Age=${1800}`,
    ];
    if (refresh_token) {
      const expiration = new Date();
      expiration.setSeconds(expiration.getSeconds() + 1800);
      tokenCookies = tokenCookies.concat([
        `Refresh=${refresh_token}; HttpOnly; Path=/; ${
          !isSameSite ? 'SameSite=None; Secure;' : ''
        } Max-Age=1800`,
        `ExpiresIn=${expiration}; Path=/; ${
          !isSameSite ? 'SameSite=None; Secure;' : ''
        } Max-Age=1800`,
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
        expiresIn: '10min',
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
