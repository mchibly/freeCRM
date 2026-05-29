import { Entity, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../common/base.entity';

@Entity('roles')
export class Role extends BaseEntity {
  @ApiProperty({ example: 'admin' })
  @Column({ unique: true })
  name: string;

  @ApiProperty({ example: 'Administrador' })
  @Column()
  label: string;

  @ApiProperty()
  @Column({ nullable: true })
  description?: string;

  @ApiProperty({ description: 'JSON com permissões por módulo', example: { leads: 'rw', clients: 'rw' } })
  @Column({ type: 'jsonb', default: {} })
  permissions: Record<string, string>;

  @ApiProperty()
  @Column({ default: true })
  isActive: boolean;
}
