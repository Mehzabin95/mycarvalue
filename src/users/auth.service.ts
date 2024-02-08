import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(
    userName: string,
    phoneNumber: string,
    email: string,
    password: string,
  ) {
    // See if email is in use
    const users = await this.usersService.find(email);
    // after finding we qill check and see if there is any user in that array
    if (users.length) {
      throw new BadRequestException('email in use');
    }
    // Hash the users password
    // 1. generate a salte
    const salt = randomBytes(8).toString('hex');

    // 2. Hash the salt and the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // 3. Join the hashed result and salt together
    const result = salt + '. ' + hash.toString('hex');

    // Create a new user and save it
    const user = await this.usersService.create(
      userName,
      phoneNumber,
      email,
      result,
    );

    // return the user
    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash.trim() !== hash.toString('hex')) {
      throw new BadRequestException('bad password');
    }
    return user;
  }
}
