import { UserType as PrismaUserType, type User as PrismaUser } from '../../../generated/prisma/client';
import { UserType } from '../entities/User';
import { CreateUserDTO } from '../dto/CreateUserDTO';
import { UpdateUserDTO } from '../dto/UpdateUserDTO';
import { User } from '../entities/User';
import { UserRepository } from './UserRepository';
import { prisma } from '../../../lib/prisma';
import bcrypt from "bcrypt";


const toDomainUserType = (type: PrismaUserType): UserType =>
  type === PrismaUserType.ADMIN ? UserType.ADMIN : UserType.NORMAL;

const toPrismaUserType = (type: UserType): PrismaUserType =>
  type === UserType.ADMIN ? PrismaUserType.ADMIN : PrismaUserType.NORMAL;

const toDomainUser = (user: PrismaUser): User => ({
  id: user.id,
  name: user.name,
  email: user.email,
  password: user.pwd_encrypted,
  type: toDomainUserType(user.type),
});

const toPublicUser = (user: PrismaUser): User => ({
  id: user.id,
  name: user.name,
  email: user.email,
  password: '', // Never expose the password
  type: toDomainUserType(user.type),
})


export class PrismaUserRepository implements UserRepository {
  async create(data: CreateUserDTO): Promise<User> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        pwd_encrypted: hashedPassword,
        type: toPrismaUserType(data.type ?? UserType.NORMAL),
      },
    });

    return toDomainUser(user);
  }

  async findById(id: number): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    return user ? toPublicUser(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    return user ? toDomainUser(user) : null;
  }

  async findAll(): Promise<User[]> {
    const users = await prisma.user.findMany({
      orderBy: { id: 'asc' }
    });

    return users.map(toPublicUser);
  }

  async update(id: number, data: UpdateUserDTO): Promise<User | null> {
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return null;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name: data.name ?? existingUser.name,
        email: data.email ?? existingUser.email,
        pwd_encrypted: data.password ?? existingUser.pwd_encrypted,
      },
    });

    return toDomainUser(updatedUser);
  }

  async delete(id: number): Promise<boolean> {
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return false;
    }

    await prisma.user.delete({
      where: { id },
    });

    return true;
  }
}