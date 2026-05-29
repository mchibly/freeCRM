'use client';

import { useEffect, useState } from 'react';
import { Button, Badge } from '@/components/ui';
import { api } from '@/lib/api';
import { Plus, Search } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  category?: string;
  price?: number;
  unit?: string;
  isActive: boolean;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/services', { params: { limit: 50 } })
      .then((res) => setServices(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = services.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Serviços</h1>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-1" /> Novo Serviço
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="search"
          placeholder="Buscar serviços..."
          className="w-full h-10 pl-9 pr-4 rounded border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-slate-900 dark:border-slate-600"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Buscar serviços"
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
                <th className="py-3 px-4 font-medium">Categoria</th>
                <th className="py-3 px-4 font-medium">Preço</th>
                <th className="py-3 px-4 font-medium">Unidade</th>
                <th className="py-3 px-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((svc) => (
                <tr key={svc.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-4 font-medium">{svc.name}</td>
                  <td className="py-3 px-4 text-slate-600">{svc.category || '—'}</td>
                  <td className="py-3 px-4">{svc.price ? `R$ ${svc.price.toLocaleString('pt-BR')}` : '—'}</td>
                  <td className="py-3 px-4 text-slate-600">{svc.unit || '—'}</td>
                  <td className="py-3 px-4">
                    <Badge variant={svc.isActive ? 'success' : 'danger'}>
                      {svc.isActive ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    Nenhum serviço encontrado.
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
