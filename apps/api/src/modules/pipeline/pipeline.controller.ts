import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PipelineService } from './pipeline.service';
import { CreateDealDto, UpdateDealDto } from './pipeline.dto';
import { PaginationDto } from '../../common/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { DealStage } from './deal.entity';

@ApiTags('pipeline')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('pipeline')
export class PipelineController {
  constructor(private readonly pipelineService: PipelineService) {}

  @Get()
  @ApiOperation({ summary: 'Listar deals (paginado)' })
  @ApiQuery({ name: 'stage', required: false, enum: DealStage })
  findAll(@Query() pagination: PaginationDto, @Query('stage') stage?: DealStage) {
    return this.pipelineService.findAll(pagination, stage);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Estatísticas do pipeline por estágio' })
  stats() {
    return this.pipelineService.stats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar deal por ID' })
  findOne(@Param('id') id: string) {
    return this.pipelineService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Criar novo deal' })
  create(@Body() dto: CreateDealDto) {
    return this.pipelineService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar deal' })
  update(@Param('id') id: string, @Body() dto: UpdateDealDto) {
    return this.pipelineService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir deal' })
  remove(@Param('id') id: string) {
    return this.pipelineService.remove(id);
  }
}
