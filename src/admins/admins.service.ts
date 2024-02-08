import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAdminDto } from './dtos/create-admin.dto';
import { Admin } from './admin.entity';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Admin)
    private repo: Repository<Admin>,
  ) {}

  create(
    adminName: string,
    phoneNumber: string,
    email: string,
    password: string,
  ) {
    const admin = this.repo.create({ adminName, phoneNumber, email, password });

    return this.repo.save(admin);
  }

  find(email: string) {
    if (!email) {
      throw new NotFoundException('user not found');
    }
    return this.repo.find({ where: { email } });
  }

  async findAll(): Promise<Admin[]> {
    return await this.repo.find();
  }
  // async findByAdmin(id: number): Promise<Admin> {
  //   return await this.repo.find({
  //     where: { id: id },
  //     relations: {
  //       report: true,
  //     },
  //   });
  // }
}
