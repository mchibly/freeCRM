'use client';

import { useEffect, useState } from 'react';
import { Button, Badge } from '@/components/ui';
import { api } from '@/lib/api';
import { Plus, Search } from 'lucide-react';

interface Order {
  id: string;
  client?: { name: string };
  total: number;
  status: string;
  paymentMethod?: string;
  createdAt: string;
}

const statusBadge: Record<string, 'info' | 'warning' | 'success' | 'danger' | 'default'> = {
  rascunho: 'default',
  pendente: 'warning',
  aprovado: 'info',
  faturado: 'success',
  cancelado: 'danger',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders', { params: { limit: 50 } })
      .then((res) => setOrders(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pedidos</h1>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-1" /> Novo Pedido
        </Button>
      </div>

      {loading ? (
        <p className="text-slate-500">Carregando...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm" role="table">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-left">
                <th className="py-3 px-4 font-medium">Pedido</th>
                <th className="py-3 px-4 font-medium">Cliente</th>
                <th className="py-3 px-4 font-medium">Total</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium">Pagamento</th>
                <th className="py-3 px-4 font-medium">Data</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-4 font-mono text-xs">{order.id.slice(0, 8)}</td>
                  <td className="py-3 px-4 font-medium">{order.client?.name || '—'}</td>
                  <td className="py-3 px-4">R$ {order.total.toLocaleString('pt-BR')}</td>
                  <td className="py-3 px-4">
                    <Badge variant={statusBadge[order.status] || 'default'}>{order.status}</Badge>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{order.paymentMethod || '—'}</td>
                  <td className="py-3 px-4 text-slate-600">
                    {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Nenhum pedido encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
