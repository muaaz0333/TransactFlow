import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { username, name, email, password, phoneNumber } = createUserDto;
      const existingUser = await this.usersRepo.findOne({ where: { email } });
      if (existingUser) {
        throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = this.usersRepo.create({
        email,
        password: hashedPassword,
        username,
        name,
        phoneNumber,
      });
      const token = await this.sendVerificationEmail(user);

      await this.usersRepo.save(user);
      return {
        message: 'User created successfully.',
        verificationToken: token,
      };
    } catch (e) {
      console.error(e);
      if (e instanceof HttpException) {
        throw e;
      }
      throw new Error('Please try again after few minutes');
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const { email, password } = loginDto;
      const user = await this.usersRepo.findOne({ where: { email } });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new HttpException(
          'Invalid Credentials',
          HttpStatus.REQUEST_TIMEOUT,
        );
      }

      if (!user.isVerified) {
        throw new HttpException(
          'Please verify your email before logging in',
          HttpStatus.FORBIDDEN,
        );
      }

      if (user.status != 'active') {
        user.status = 'active';
        await this.usersRepo.save(user);
      }

      const payload = { sub: user.id, email: user.email };
      const token = await this.jwtService.signAsync(payload);

      return {
        accessToken: token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          username: user.username,
          phoneNumber: user.phoneNumber,
          status: user.status,
          isVerified: user.isVerified,
        },
      };
    } catch (e) {
      console.error(e);
      if (e instanceof HttpException) {
        throw e;
      }
      throw new HttpException('Failed to login', HttpStatus.FORBIDDEN);
    }
  }

  async sendVerificationEmail(user: User) {
    const payload = { sub: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1h',
    });
    return token;
  }

  async verifyEmail(token: string): Promise<string> {
    try {
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      const user = await this.usersRepo.findOne({
        where: { email: decoded.email },
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      if (user.isVerified) {
        return 'User is already verified';
      }

      user.isVerified = true;
      await this.usersRepo.save(user);
      return 'Email verified Successfully.';
    } catch (e) {
      console.error(e);
      if (e instanceof HttpException) {
        throw e;
      }
      throw new HttpException('Failed to verify email', HttpStatus.FORBIDDEN);
    }
  }

  async resendVerificationEmail(email: string) {
    const user = await this.usersRepo.findOne({ where: { email } });
    console.log('fetched user', user);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (user.isVerified) {
      throw new HttpException('User already verified', HttpStatus.FORBIDDEN);
    }

    return this.sendVerificationEmail(user);
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
