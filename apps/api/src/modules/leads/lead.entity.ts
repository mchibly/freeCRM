import { Entity, Column, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../common/base.entity';
import { User } from '../users/user.entity';

export enum LeadStage {
  NOVO = 'novo',
  QUALIFICADO = 'qualificado',
  PROPOSTA = 'proposta',
  NEGOCIACAO = 'negociacao',
  FECHADO = 'fechado',
  PERDIDO = 'perdido',
}

@Entity('leads')
export class Lead extends BaseEntity {
  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column({ nullable: true })
  company?: string;

  @ApiProperty()
  @Column({ nullable: true })
  email?: string;

  @ApiProperty()
  @Column({ nullable: true })
  phone?: string;

  @ApiProperty({ enum: LeadStage })
  @Column({ type: 'enum', enum: LeadStage, default: LeadStage.NOVO })
  stage: LeadStage;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  value: number;

  @ApiProperty()
  @Column({ nullable: true })
  source?: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, { nullable: true })
  assignee?: User;

  @Column({ nullable: true })
  assigneeId?: string;
}
