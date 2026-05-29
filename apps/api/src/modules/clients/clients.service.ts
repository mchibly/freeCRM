import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Client } from './client.entity';
import { CreateClientDto, UpdateClientDto } from './clients.dto';
import { PaginationDto, PaginatedResult } from '../../common/pagination.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly repo: Repository<Client>,
  ) {}

  async findAll(pagination: PaginationDto, search?: string): Promise<PaginatedResult<Client>> {
    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'DESC' } = pagination;
    const qb = this.repo.createQueryBuilder('client').where('client.deletedAt IS NULL');

    if (search) {
      qb.andWhere('(client.name ILIKE :s OR client.contactName ILIKE :s OR client.email ILIKE :s)', { s: `%${search}%` });
    }

    qb.orderBy(`client.${sortBy}`, sortOrder)
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string): Promise<Client> {
    const client = await this.repo.findOne({ where: { id } });
    if (!client) throw new NotFoundException('Cliente não encontrado');
    return client;
  }

  async create(dto: CreateClientDto): Promise<Client> {
    const client = this.repo.create(dto);
    return this.repo.save(client);
  }

  async update(id: string, dto: UpdateClientDto): Promise<Client> {
    const client = await this.findOne(id);
    Object.assign(client, dto);
    return this.repo.save(client);
  }

  async remove(id: string): Promise<void> {
    const client = await this.findOne(id);
    await this.repo.softRemove(client);
  }
}
