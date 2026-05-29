'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, Badge } from '@/components/ui';
import { api } from '@/lib/api';
import { Users, Target, ShoppingCart, DollarSign } from 'lucide-react';

interface Stats {
  totalLeads: number;
  totalClients: number;
  totalOrders: number;
  revenue: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ totalLeads: 0, totalClients: 0, totalOrders: 0, revenue: 0 });

  useEffect(() => {
    Promise.allSettled([
      api.get('/leads?limit=1'),
      api.get('/clients?limit=1'),
      api.get('/orders?limit=1'),
    ]).then(([leads, clients, orders]) => {
      setStats({
        totalLeads: leads.status === 'fulfilled' ? leads.value.data.meta.total : 0,
        totalClients: clients.status === 'fulfilled' ? clients.value.data.meta.total : 0,
        totalOrders: orders.status === 'fulfilled' ? orders.value.data.meta.total : 0,
        revenue: 0,
      });
    });
  }, []);

  const kpis = [
    { label: 'Leads', value: stats.totalLeads, icon: Target, color: 'text-blue-600' },
    { label: 'Clientes', value: stats.totalClients, icon: Users, color: 'text-green-600' },
    { label: 'Pedidos', value: stats.totalOrders, icon: ShoppingCart, color: 'text-purple-600' },
    { label: 'Receita', value: `R$ ${stats.revenue.toLocaleString('pt-BR')}`, icon: DollarSign, color: 'text-emerald-600' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{kpi.label}</p>
                <p className="text-2xl font-bold mt-1">{kpi.value}</p>
              </div>
              <kpi.icon className={`w-10 h-10 ${kpi.color} opacity-80`} aria-hidden="true" />
            </div>
          </Card>
        ))}
      </div>

      {/* Placeholder sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pipeline de Vendas</CardTitle>
          </CardHeader>
          <p className="text-slate-500 text-sm">Gráfico de funil será exibido aqui.</p>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
          </CardHeader>
          <p className="text-slate-500 text-sm">Últimas ações do sistema.</p>
        </Card>
      </div>
    </div>
  );
}
