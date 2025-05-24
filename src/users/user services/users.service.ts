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

      await this.usersRepo.save(user);
      return { message: 'User created successfully.' };
    } catch (e) {
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
        },
      };
    } catch (e) {
      throw new HttpException('Unauthorized', HttpStatus.BAD_REQUEST);
    }
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
