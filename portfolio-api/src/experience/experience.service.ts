import { Injectable } from '@nestjs/common';
import { CreateExperienceDto } from './dto/create-experience.dto.js';
import { UpdateExperienceDto } from './dto/update-experience.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ExperienceService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateExperienceDto) {
    return this.prisma.experience.create({
      data: createDto,
    });
  }

  async findAll() {
    return this.prisma.experience.findMany({
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.experience.findUnique({ where: { id } });
  }

  async update(id: number, updateDto: UpdateExperienceDto) {
    return this.prisma.experience.update({
      where: { id },
      data: updateDto,
    });
  }

  async remove(id: number) {
    return this.prisma.experience.delete({ where: { id } });
  }
}