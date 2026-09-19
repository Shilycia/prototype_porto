import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkDto } from './create-work.dto.js';

export class UpdateWorkDto extends PartialType(CreateWorkDto) {}
