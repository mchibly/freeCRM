import { Entity, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../common/base.entity';

@Entity('products')
export class Product extends BaseEntity {
  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column({ nullable: true, unique: true })
  sku?: string;

  @ApiProperty()
  @Column({ nullable: true })
  category?: string;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  price: number;

  @ApiProperty()
  @Column({ type: 'int', default: 0 })
  stock: number;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ enum: ['ativo', 'inativo', 'descontinuado'] })
  @Column({ default: 'ativo' })
  status: string;
}
