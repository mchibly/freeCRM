import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deal, DealStage } from './deal.entity';
import { CreateDealDto, UpdateDealDto } from './pipeline.dto';
import { PaginationDto, PaginatedResult } from '../../common/pagination.dto';

@Injectable()
export class PipelineService {
  constructor(
    @InjectRepository(Deal)
    private readonly repo: Repository<Deal>,
  ) {}

  async findAll(pagination: PaginationDto, stage?: DealStage): Promise<PaginatedResult<Deal>> {
    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'DESC' } = pagination;
    const qb = this.repo.createQueryBuilder('deal')
      .leftJoinAndSelect('deal.client', 'client')
      .leftJoinAndSelect('deal.assignee', 'assignee')
      .where('deal.deletedAt IS NULL');

    if (stage) qb.andWhere('deal.stage = :stage', { stage });

    qb.orderBy(`deal.${sortBy}`, sortOrder)
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string): Promise<Deal> {
    const deal = await this.repo.findOne({ where: { id }, relations: ['client', 'assignee'] });
    if (!deal) throw new NotFoundException('Deal não encontrado');
    return deal;
  }

  async create(dto: CreateDealDto): Promise<Deal> {
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: string, dto: UpdateDealDto): Promise<Deal> {
    const deal = await this.findOne(id);
    Object.assign(deal, dto);
    return this.repo.save(deal);
  }

  async remove(id: string): Promise<void> {
    await this.repo.softRemove(await this.findOne(id));
  }

  async stats() {
    const stages = await this.repo.createQueryBuilder('deal')
      .select('deal.stage', 'stage')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(deal.value)', 'totalValue')
      .where('deal.deletedAt IS NULL')
      .groupBy('deal.stage')
      .getRawMany();
    return stages;
  }
}
