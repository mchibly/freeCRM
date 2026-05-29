'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, Badge, Button } from '@/components/ui';
import { api } from '@/lib/api';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Deal {
  id: string;
  title: string;
  client?: { name: string };
  value: number;
  stage: string;
  probability: number;
}

const stages = [
  { key: 'prospeccao', label: 'Prospecção', color: 'bg-slate-100 dark:bg-slate-800' },
  { key: 'qualificacao', label: 'Qualificação', color: 'bg-blue-50 dark:bg-blue-900/20' },
  { key: 'proposta', label: 'Proposta', color: 'bg-yellow-50 dark:bg-yellow-900/20' },
  { key: 'negociacao', label: 'Negociação', color: 'bg-purple-50 dark:bg-purple-900/20' },
  { key: 'fechado_ganho', label: 'Ganho', color: 'bg-green-50 dark:bg-green-900/20' },
  { key: 'fechado_perda', label: 'Perdido', color: 'bg-red-50 dark:bg-red-900/20' },
];

export default function PipelinePage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/pipeline', { params: { limit: 100 } })
      .then((res) => setDeals(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const grouped = stages.map((s) => ({
    ...s,
    deals: deals.filter((d) => d.stage === s.key),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pipeline de Vendas</h1>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-1" /> Novo Deal
        </Button>
      </div>

      {loading ? (
        <p className="text-slate-500">Carregando...</p>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4" role="region" aria-label="Kanban do pipeline">
          {grouped.map((stage) => (
            <div key={stage.key} className="flex-shrink-0 w-72">
              <div className={cn('rounded-lg p-3', stage.color)}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold">{stage.label}</h2>
                  <Badge>{stage.deals.length}</Badge>
                </div>
                <div className="space-y-2">
                  {stage.deals.map((deal) => (
                    <Card key={deal.id} className="p-3 cursor-pointer hover:shadow-md transition-shadow">
                      <p className="font-medium text-sm">{deal.title}</p>
                      <p className="text-xs text-slate-500 mt-1">{deal.client?.name || 'Sem cliente'}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs font-semibold text-brand-600">
                          R$ {deal.value.toLocaleString('pt-BR')}
                        </span>
                        <span className="text-xs text-slate-400">{deal.probability}%</span>
                      </div>
                    </Card>
                  ))}
                  {stage.deals.length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-4">Sem deals</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
