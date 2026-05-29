import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../common/base.entity';
import { Client } from '../clients/client.entity';

export enum OrderStatus {
  PENDENTE = 'pendente',
  PROCESSANDO = 'processando',
  CONCLUIDO = 'concluido',
  CANCELADO = 'cancelado',
}

@Entity('orders')
export class Order extends BaseEntity {
  @ApiProperty({ type: () => Client })
  @ManyToOne(() => Client)
  client: Client;

  @Column()
  clientId: string;

  @ApiProperty({ description: 'Itens do pedido em JSON' })
  @Column({ type: 'jsonb', default: [] })
  items: Array<{ type: 'product' | 'service'; id: string; name: string; quantity: number; unitPrice: number }>;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 14, scale: 2, default: 0 })
  total: number;

  @ApiProperty({ enum: OrderStatus })
  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDENTE })
  status: OrderStatus;

  @ApiProperty()
  @Column({ nullable: true })
  paymentMethod?: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  notes?: string;
}
