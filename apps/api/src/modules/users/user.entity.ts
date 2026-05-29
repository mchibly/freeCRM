import { Entity, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntity } from '../../common/base.entity';
import { Role } from '../roles/role.entity';

@Entity('users')
export class User extends BaseEntity {
  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column({ unique: true })
  email: string;

  @ApiPropertyOptional({ description: 'Keycloak subject ID' })
  @Column({ nullable: true, unique: true })
  keycloakId?: string;

  @ApiProperty()
  @Column({ nullable: true })
  avatarUrl?: string;

  @ApiProperty()
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ type: () => Role })
  @ManyToOne(() => Role, { eager: true })
  role: Role;

  @Column({ nullable: true })
  roleId?: string;
}
