import { ConflictException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/core/database/database.service';
import { CreateRegisterDto } from './dto/create.register.dto';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { CreateLoginDto } from './dto/create.login.dto';
import { UpdateUserRoleDto } from './dto/update.user.role.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly db: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createRegisterDto: CreateRegisterDto) {
    const findEmail = await this.db.prisma.user.findUnique({
      where: { email: createRegisterDto.email },
    });

    if (findEmail) throw new ConflictException('This email is registered.');

    const hashPassword = await bcrypt.hash(createRegisterDto.password, 12);

    const user = await this.db.prisma.user.create({
      data: {
        ...createRegisterDto,
        password: hashPassword,
      },
    });

    const access_token = await this.jwtService.signAsync({
      userId: user.id,
      role: user.role,
    });

    return access_token;
  }

  async login(createLoginDto: CreateLoginDto) {
    const findEmail = await this.db.prisma.user.findUnique({
      where: { email: createLoginDto.email },
    });

    if (!findEmail)
      throw new ConflictException('This email or password does not exist.');

    const comparePassword = await bcrypt.compare(
      createLoginDto.password,
      findEmail.password,
    );

    if (!comparePassword)
      throw new ConflictException('This email or password does not exist.');

    const access_token = await this.jwtService.signAsync({
      userId: findEmail.id,
      role: findEmail.role,
    });

    return access_token;
  }

  async me(userId: string) {
    const findUser = await this.db.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!findUser) throw new ConflictException('User not found');

    return findUser;
  }

  async updateUserRole(updateUserRoleDto: UpdateUserRoleDto, id: string) {
    const updateUser = await this.db.prisma.user.findUnique({
      where: { id: id },
    });

    if (!updateUser) throw new ConflictException('User not found');

    await this.db.prisma.user.update({
      where: { id: id },
      data: { role: updateUserRoleDto.role },
    });

    if (!updateUser) throw new ConflictException('User not found');

    return { message: 'Create admin' };
  }
}
