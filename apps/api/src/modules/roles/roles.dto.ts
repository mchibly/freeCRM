import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsObject } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'gerente' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Gerente' })
  @IsString()
  label: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: { leads: 'rw', clients: 'rw', products: 'r' } })
  @IsOptional()
  @IsObject()
  permissions?: Record<string, string>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}
