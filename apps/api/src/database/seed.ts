import { DataSource } from 'typeorm';
import { Role } from '../modules/roles/role.entity';
import { User } from '../modules/users/user.entity';
import { Lead } from '../modules/leads/lead.entity';
import { Client } from '../modules/clients/client.entity';
import { Service } from '../modules/services/service.entity';
import { Product } from '../modules/products/product.entity';
import { Order } from '../modules/orders/order.entity';
import { Deal } from '../modules/pipeline/deal.entity';

export async function seed(dataSource: DataSource) {
  const roleRepo = dataSource.getRepository(Role);
  const userRepo = dataSource.getRepository(User);
  const leadRepo = dataSource.getRepository(Lead);
  const clientRepo = dataSource.getRepository(Client);
  const serviceRepo = dataSource.getRepository(Service);
  const productRepo = dataSource.getRepository(Product);

  // Roles
  const adminRole = await roleRepo.save(roleRepo.create({
    name: 'admin',
    label: 'Administrador',
    description: 'Acesso total ao sistema',
    permissions: ['*'],
    isActive: true,
  }));

  const vendedorRole = await roleRepo.save(roleRepo.create({
    name: 'vendedor',
    label: 'Vendedor',
    description: 'Gerencia leads, clientes, pedidos e pipeline',
    permissions: ['leads:*', 'clients:*', 'orders:*', 'pipeline:*', 'products:read', 'services:read'],
    isActive: true,
  }));

  await roleRepo.save(roleRepo.create({
    name: 'viewer',
    label: 'Visualizador',
    description: 'Apenas leitura',
    permissions: ['leads:read', 'clients:read', 'orders:read', 'pipeline:read', 'products:read', 'services:read'],
    isActive: true,
  }));

  // Users
  const admin = await userRepo.save(userRepo.create({
    name: 'Admin',
    email: 'admin@freecrm.local',
    isActive: true,
    role: adminRole,
  }));

  const vendedor = await userRepo.save(userRepo.create({
    name: 'João Silva',
    email: 'joao@freecrm.local',
    isActive: true,
    role: vendedorRole,
  }));

  // Clients
  const clients = await clientRepo.save([
    clientRepo.create({ name: 'Tech Solutions Ltda', tradeName: 'TechSol', contactName: 'Carlos Mendes', email: 'carlos@techsol.com.br', phone: '11999001234', cnpj: '12.345.678/0001-99', segment: 'Tecnologia', isActive: true }),
    clientRepo.create({ name: 'Comércio ABC S.A.', tradeName: 'ABC Store', contactName: 'Maria Oliveira', email: 'maria@abcstore.com.br', phone: '11988007654', cnpj: '98.765.432/0001-11', segment: 'Varejo', isActive: true }),
    clientRepo.create({ name: 'Indústria MetalForte', tradeName: 'MetalForte', contactName: 'Roberto Lima', email: 'roberto@metalforte.ind.br', phone: '19977004321', cnpj: '55.123.456/0001-77', segment: 'Indústria', isActive: true }),
  ]);

  // Leads
  await leadRepo.save([
    leadRepo.create({ name: 'Ana Costa', company: 'StartupX', email: 'ana@startupx.io', phone: '11966005555', stage: 'novo', value: 15000, source: 'site', assignee: vendedor }),
    leadRepo.create({ name: 'Pedro Souza', company: 'LogiMax', email: 'pedro@logimax.com', phone: '21955004444', stage: 'contatado', value: 32000, source: 'indicacao', assignee: vendedor }),
    leadRepo.create({ name: 'Fernanda Reis', company: 'EduPro', email: 'fernanda@edupro.com.br', phone: '31944003333', stage: 'qualificado', value: 48000, source: 'linkedin', assignee: admin }),
    leadRepo.create({ name: 'Lucas Martins', company: 'FoodTech', email: 'lucas@foodtech.app', phone: '41933002222', stage: 'proposta', value: 75000, source: 'evento' }),
    leadRepo.create({ name: 'Juliana Alves', company: 'HealthPlus', email: 'juliana@healthplus.com', phone: '51922001111', stage: 'ganho', value: 120000, source: 'site', assignee: vendedor }),
  ]);

  // Services
  const services = await serviceRepo.save([
    serviceRepo.create({ name: 'Consultoria em TI', category: 'Consultoria', price: 250, unit: 'hora', isActive: true }),
    serviceRepo.create({ name: 'Desenvolvimento Web', category: 'Desenvolvimento', price: 180, unit: 'hora', isActive: true }),
    serviceRepo.create({ name: 'Suporte Técnico', category: 'Suporte', price: 3500, unit: 'mês', isActive: true }),
    serviceRepo.create({ name: 'Treinamento', category: 'Educação', price: 5000, unit: 'turma', isActive: true }),
  ]);

  // Products
  const products = await productRepo.save([
    productRepo.create({ name: 'Licença CRM Pro', sku: 'LIC-CRM-PRO', category: 'Software', price: 299, stock: 999, status: 'ativo' }),
    productRepo.create({ name: 'Módulo Analytics', sku: 'MOD-ANALYTICS', category: 'Software', price: 149, stock: 999, status: 'ativo' }),
    productRepo.create({ name: 'Setup Premium', sku: 'SVC-SETUP-P', category: 'Serviço', price: 4500, stock: 50, status: 'ativo' }),
  ]);

  console.log('✅ Seed concluído com sucesso');
  console.log(`   - ${3} roles, ${2} users, ${5} leads, ${3} clients, ${4} services, ${3} products`);
}
