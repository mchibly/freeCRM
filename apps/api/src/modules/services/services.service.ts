import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './service.entity';
import { CreateServiceDto, UpdateServiceDto } from './services.dto';
import { PaginationDto, PaginatedResult } from '../../common/pagination.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly repo: Repository<Service>,
  ) {}

  async findAll(pagination: PaginationDto): Promise<PaginatedResult<Service>> {
    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'DESC' } = pagination;
    const [data, total] = await this.repo.findAndCount({
      order: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string): Promise<Service> {
    const svc = await this.repo.findOne({ where: { id } });
    if (!svc) throw new NotFoundException('Serviço não encontrado');
    return svc;
  }

  async create(dto: CreateServiceDto): Promise<Service> {
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: string, dto: UpdateServiceDto): Promise<Service> {
    const svc = await this.findOne(id);
    Object.assign(svc, dto);
    return this.repo.save(svc);
  }

  async remove(id: string): Promise<void> {
    await this.repo.softRemove(await this.findOne(id));
  }
}
