import { Entity, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../common/base.entity';

@Entity('clients')
export class Client extends BaseEntity {
  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column({ nullable: true })
  tradeName?: string;

  @ApiProperty()
  @Column({ nullable: true })
  contactName?: string;

  @ApiProperty()
  @Column({ nullable: true })
  email?: string;

  @ApiProperty()
  @Column({ nullable: true })
  phone?: string;

  @ApiProperty()
  @Column({ nullable: true, unique: true })
  cnpj?: string;

  @ApiProperty()
  @Column({ nullable: true })
  segment?: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  address?: string;

  @ApiProperty()
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 14, scale: 2, default: 0 })
  totalRevenue: number;
}
