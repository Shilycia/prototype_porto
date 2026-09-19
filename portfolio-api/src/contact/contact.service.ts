import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto.js';
import { UpdateContactDto } from './dto/update-contact.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateContactDto) {
    return this.prisma.contact.create({
      data: createDto as any,
    });
  }

  async findAll() {
    return this.prisma.contact.findMany();
  }

  async findOne(id: number) {
    return this.prisma.contact.findUnique({ where: { id } });
  }

  async update(id: number, updateDto: UpdateContactDto) {
    return this.prisma.contact.update({
      where: { id },
      data: updateDto as any,
    });
  }

  async remove(id: number) {
    return this.prisma.contact.delete({ where: { id } });
  }
}