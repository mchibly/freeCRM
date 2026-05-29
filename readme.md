# freeCRM

Sistema web CRM open-source com módulos de gestão de leads, clientes, serviços, produtos, pedidos, pipeline de vendas (Kanban), controle de usuários, RBAC e **configurador de design system em tempo real**.

## Arquitetura

| Camada | Tecnologia | Descrição |
|--------|-----------|-----------|
| Frontend | Next.js 14 (React 18) | App Router, SSR standalone, Tailwind CSS, WCAG 2.1 AA |
| Backend | NestJS 10 (TypeScript) | API REST versionada (URI `/v1`), OpenAPI/Swagger, class-validator |
| Banco de Dados | PostgreSQL 16 | TypeORM, UUID PKs, soft-delete, JSONB, enums |
| Cache/Fila | Redis 7 | Sessões, rate-limiting (Throttler), filas assíncronas |
| Storage | MinIO | S3-compatible para objetos/arquivos |
| IAM | Keycloak 24 | OAuth2/OIDC, login social, gestão de tokens |
| Containers | Docker | Multi-stage builds, non-root, Alpine |
| Orquestração | Kubernetes | Kustomize (base + overlays dev/prod), health probes, Ingress TLS |
| IaC | OpenTofu/Terraform | Módulos Azure (VNet, PostgreSQL Flexible, AKS) |
| CI/CD | GitHub Actions | Lint → Test → Build → Deploy (AKS) |

## Estrutura do Projeto

```
freeCRM/
├── apps/
│   ├── api/                        # NestJS Backend
│   │   └── src/
│   │       ├── common/             # Guards, decorators, base entity, pagination
│   │       ├── modules/
│   │       │   ├── auth/           # JWT + Keycloak integration
│   │       │   ├── users/          # CRUD usuários
│   │       │   ├── roles/          # CRUD perfis + permissões JSONB
│   │       │   ├── leads/          # Funil de captação + stats
│   │       │   ├── clients/        # Base de clientes (ILIKE search)
│   │       │   ├── services/       # Catálogo de serviços
│   │       │   ├── products/       # Catálogo de produtos (SKU, estoque)
│   │       │   ├── orders/         # Pedidos (items JSONB, client FK)
│   │       │   ├── pipeline/       # Deals Kanban (stages, probability)
│   │       │   └── health/         # Liveness + Readiness probes
│   │       └── database/
│   │           └── seed.ts         # Dados demo
│   └── web/                        # Next.js Frontend
│       └── src/
│           ├── app/
│           │   ├── (auth)/login/   # Tela de login
│           │   └── (dashboard)/    # Layout autenticado (sidebar + header)
│           │       ├── dashboard/  # KPIs e gráficos
│           │       ├── leads/      # Tabela de leads
│           │       ├── clients/    # Tabela de clientes
│           │       ├── services/   # Tabela de serviços
│           │       ├── products/   # Tabela de produtos
│           │       ├── orders/     # Tabela de pedidos
│           │       ├── pipeline/   # Kanban visual
│           │       └── admin/
│           │           ├── users/          # Gestão de usuários
│           │           ├── rbac/           # Gestão de perfis
│           │           └── design-system/  # Configurador (cores, font, radius)
│           ├── components/
│           │   ├── ui/             # Button, Input, Card, Badge
│           │   └── layout/         # Sidebar, Header
│           ├── hooks/              # useAuth (Zustand)
│           ├── lib/                # API client (Axios), utils (cn)
│           └── styles/             # globals.css (CSS vars + Tailwind)
├── infra/
│   ├── docker/
│   │   ├── Dockerfile.api         # Multi-stage (deps → build → prod)
│   │   └── Dockerfile.web         # Multi-stage (standalone output)
│   ├── k8s/
│   │   ├── base/                   # Deployments, Services, Ingress, ConfigMap
│   │   └── overlays/
│   │       ├── dev/                # 1 réplica, host dev.*
│   │       └── prod/               # 3 réplicas
│   └── terraform/
│       ├── modules/
│       │   ├── networking/         # VNet, subnets, NSG
│       │   ├── database/           # PostgreSQL Flexible Server
│       │   └── kubernetes/         # AKS cluster
│       └── environments/
│           ├── dev/                # B_Standard_B1ms, 1 node
│           └── prod/               # GP_Standard_D2s_v3, 3 nodes
├── .github/workflows/ci.yml       # CI/CD pipeline
├── docker-compose.yml              # Dev (Postgres, Redis, MinIO, Keycloak)
├── pnpm-workspace.yaml
├── .env.example
└── README.md
```

## Pré-requisitos

- **Node.js 20+** / **pnpm 9+**
- **Docker** & Docker Compose
- (Opcional) kubectl, terraform/tofu para deploy em cloud

## Início Rápido

```bash
# 1. Clonar e instalar dependências
git clone https://github.com/mchibly/freeCRM.git && cd freeCRM
pnpm install

# 2. Configurar variáveis de ambiente
cp .env.example .env

# 3. Subir infraestrutura local (Postgres, Redis, MinIO, Keycloak)
docker compose up -d

# 4. Rodar migrations e seed
pnpm db:migrate
pnpm db:seed

# 5. Iniciar em desenvolvimento
pnpm dev
```

### URLs locais

| Serviço | URL |
|---------|-----|
| **Web (frontend)** | http://localhost:3000 |
| **API (backend)** | http://localhost:3001 |
| **Swagger/OpenAPI** | http://localhost:3001/api/docs |
| **Keycloak** | http://localhost:8080 (admin/admin) |
| **MinIO Console** | http://localhost:9001 (minioadmin/minioadmin) |

## Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `pnpm dev` | Inicia API + Web em paralelo |
| `pnpm build` | Build de produção (ambos) |
| `pnpm test` | Testes unitários |
| `pnpm test:e2e` | Testes end-to-end |
| `pnpm lint` | ESLint em todos os workspaces |
| `pnpm db:migrate` | Executa migrations pendentes |
| `pnpm db:seed` | Popular banco com dados demo |
| `pnpm docker:up` | `docker compose up -d` |
| `pnpm docker:down` | `docker compose down` |

## Módulos do CRM

| Módulo | Rota API | Frontend | Descrição |
|--------|----------|----------|-----------|
| Auth | `POST /auth/login`, `GET /auth/me` | `/login` | JWT + Keycloak |
| Users | `/users` (CRUD) | `/admin/users` | Gestão de usuários |
| Roles/RBAC | `/roles` (CRUD) | `/admin/rbac` | Perfis + permissões JSONB |
| Leads | `/leads` (CRUD + stats) | `/leads` | Funil de captação (estágios) |
| Clients | `/clients` (CRUD + search) | `/clients` | Base de clientes com busca |
| Services | `/services` (CRUD) | `/services` | Catálogo de serviços |
| Products | `/products` (CRUD) | `/products` | Catálogo (SKU, estoque, status) |
| Orders | `/orders` (CRUD + filter) | `/orders` | Pedidos com items JSONB |
| Pipeline | `/pipeline` (CRUD + stats) | `/pipeline` | Kanban de deals por estágio |
| Design System | — | `/admin/design-system` | Configurador em tempo real |
| Health | `GET /health`, `GET /health/ready` | — | Liveness/readiness para K8s |

## Stack Frontend

- **React Query** (TanStack) — cache & sync com API
- **Zustand** — estado global (auth)
- **Axios** — HTTP client com interceptors JWT
- **Tailwind CSS** — utility-first + CSS custom properties
- **Lucide React** — ícones
- **Design System configurável** — cores, fonte, radius via admin

## Segurança

- Helmet (headers HTTP)
- Rate-limiting (Throttler: 100 req/min)
- Validation Pipe (class-validator, whitelist)
- JWT Bearer token via Passport
- RBAC Guard com bypass de admin
- Soft-delete em todas as entidades
- CORS configurável por env

## Deploy

### Docker (multi-stage)

```bash
# Build images
docker build -f infra/docker/Dockerfile.api -t freecrm/api .
docker build -f infra/docker/Dockerfile.web -t freecrm/web .
```

### Kubernetes (Kustomize)

```bash
# Dev
kubectl apply -k infra/k8s/overlays/dev

# Produção (3 réplicas, TLS)
kubectl apply -k infra/k8s/overlays/prod
```

### Terraform/OpenTofu (Azure)

```bash
cd infra/terraform/environments/prod
tofu init
tofu plan -var="db_admin_password=<STRONG_PASSWORD>"
tofu apply
```

### GitHub Actions CI/CD

O pipeline (`.github/workflows/ci.yml`) executa automaticamente:

1. **Lint + Type-check + Tests** (em PRs e pushes)
2. **Build & push** imagens Docker para GHCR (em push para main/develop)
3. **Deploy** automático para AKS (develop → dev, main → prod)

## Licença

MIT