'use client';

import { useEffect, useState } from 'react';
import { Card, Button, Badge, Input } from '@/components/ui';
import { api } from '@/lib/api';
import { Plus, Search } from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  company?: string;
  email?: string;
  stage: string;
  value?: number;
  source?: string;
}

const stageBadge: Record<string, 'info' | 'warning' | 'success' | 'danger' | 'default'> = {
  novo: 'info',
  contatado: 'warning',
  qualificado: 'success',
  proposta: 'warning',
  ganho: 'success',
  perdido: 'danger',
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/leads', { params: { limit: 50 } })
      .then((res) => setLeads(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = leads.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.company?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Leads</h1>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-1" /> Novo Lead
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="search"
          placeholder="Buscar leads..."
          className="w-full h-10 pl-9 pr-4 rounded border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-slate-900 dark:border-slate-600"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Buscar leads"
        />
      </div>

      {loading ? (
        <p className="text-slate-500">Carregando...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm" role="table">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-left">
                <th className="py-3 px-4 font-medium">Nome</th>
                <th className="py-3 px-4 font-medium">Empresa</th>
                <th className="py-3 px-4 font-medium">E-mail</th>
                <th className="py-3 px-4 font-medium">Estágio</th>
                <th className="py-3 px-4 font-medium">Valor</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => (
                <tr key={lead.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-4 font-medium">{lead.name}</td>
                  <td className="py-3 px-4 text-slate-600">{lead.company || '—'}</td>
                  <td className="py-3 px-4 text-slate-600">{lead.email || '—'}</td>
                  <td className="py-3 px-4">
                    <Badge variant={stageBadge[lead.stage] || 'default'}>{lead.stage}</Badge>
                  </td>
                  <td className="py-3 px-4">
                    {lead.value ? `R$ ${lead.value.toLocaleString('pt-BR')}` : '—'}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    Nenhum lead encontrado.
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
