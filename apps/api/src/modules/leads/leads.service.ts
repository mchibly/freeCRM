import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Lead } from './lead.entity';
import { CreateLeadDto, UpdateLeadDto, LeadFilterDto } from './leads.dto';
import { PaginationDto, PaginatedResult } from '../../common/pagination.dto';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead)
    private readonly repo: Repository<Lead>,
  ) {}

  async findAll(pagination: PaginationDto, filters: LeadFilterDto): Promise<PaginatedResult<Lead>> {
    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'DESC' } = pagination;
    const where: FindOptionsWhere<Lead> = {};
    if (filters.stage) where.stage = filters.stage;
    if (filters.source) where.source = filters.source;
    if (filters.assigneeId) where.assigneeId = filters.assigneeId;

    const [data, total] = await this.repo.findAndCount({
      where,
      order: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['assignee'],
    });
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string): Promise<Lead> {
    const lead = await this.repo.findOne({ where: { id }, relations: ['assignee'] });
    if (!lead) throw new NotFoundException('Lead não encontrado');
    return lead;
  }

  async create(dto: CreateLeadDto): Promise<Lead> {
    const lead = this.repo.create(dto);
    return this.repo.save(lead);
  }

  async update(id: string, dto: UpdateLeadDto): Promise<Lead> {
    const lead = await this.findOne(id);
    Object.assign(lead, dto);
    return this.repo.save(lead);
  }

  async remove(id: string): Promise<void> {
    const lead = await this.findOne(id);
    await this.repo.softRemove(lead);
  }

  async getStats() {
    const stages = await this.repo
      .createQueryBuilder('lead')
      .select('lead.stage', 'stage')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(lead.value)', 'totalValue')
      .groupBy('lead.stage')
      .getRawMany();
    return stages;
  }
}
