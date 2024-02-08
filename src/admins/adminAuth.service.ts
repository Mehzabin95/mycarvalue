import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAdminDto } from './dtos/create-admin.dto';
import { Admin } from './admin.entity';
import { AdminsService } from './admins.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AdminsAuthService {
  constructor(private adminsService: AdminsService) {}

  async signup(
    adminName: string,
    phoneNumber: string,
    email: string,
    password: string,
  ) {
    const admins = await this.adminsService.find(email);

    // after finding we qill check and see if there is any admin in that array
    if (admins.length) {
      throw new BadRequestException('email in use');
    }

    // Hashing
    // 1. generate a salte
    const salt = randomBytes(8).toString('hex');

    // 2. Hash the salt and the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // 3. Join the hashed result and salt together
    const result = salt + '. ' + hash.toString('hex');

    // Create a new user and save it
    const admin = await this.adminsService.create(
      adminName,
      phoneNumber,
      email,
      result,
    );

    // return the user
    return admin;
  }

  async signin(email: string, password: string) {
    const [admin] = await this.adminsService.find(email);

    if (!admin) {
      throw new NotFoundException('user not found');
    }

    const [salt, storedHash] = admin.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash.trim() !== hash.toString('hex')) {
      throw new BadRequestException('bad password');
    }
    return admin;
  }
}
