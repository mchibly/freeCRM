import { Entity, Column, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../common/base.entity';
import { Client } from '../clients/client.entity';
import { User } from '../users/user.entity';

export enum DealStage {
  PROSPECCAO = 'prospeccao',
  QUALIFICACAO = 'qualificacao',
  PROPOSTA = 'proposta',
  NEGOCIACAO = 'negociacao',
  FECHADO_GANHO = 'fechado_ganho',
  FECHADO_PERDA = 'fechado_perda',
}

@Entity('deals')
export class Deal extends BaseEntity {
  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty({ type: () => Client })
  @ManyToOne(() => Client)
  client: Client;

  @Column()
  clientId: string;

  @ApiProperty({ description: 'Produtos e serviços vinculados' })
  @Column({ type: 'jsonb', default: [] })
  items: Array<{ type: 'product' | 'service'; id: string; name: string }>;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 14, scale: 2, default: 0 })
  value: number;

  @ApiProperty({ enum: DealStage })
  @Column({ type: 'enum', enum: DealStage, default: DealStage.PROSPECCAO })
  stage: DealStage;

  @ApiProperty({ minimum: 0, maximum: 100 })
  @Column({ type: 'int', default: 20 })
  probability: number;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, { nullable: true })
  assignee?: User;

  @Column({ nullable: true })
  assigneeId?: string;

  @ApiProperty()
  @Column({ type: 'date', nullable: true })
  expectedCloseDate?: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  notes?: string;
}
