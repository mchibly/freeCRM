'use client';

import { useEffect, useState } from 'react';
import { Button, Badge } from '@/components/ui';
import { api } from '@/lib/api';
import { Plus, Search } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  sku?: string;
  category?: string;
  price?: number;
  stock?: number;
  status: string;
}

const statusBadge: Record<string, 'success' | 'danger' | 'warning' | 'default'> = {
  ativo: 'success',
  inativo: 'danger',
  descontinuado: 'warning',
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products', { params: { limit: 50 } })
      .then((res) => setProducts(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Produtos</h1>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-1" /> Novo Produto
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="search"
          placeholder="Buscar produtos..."
          className="w-full h-10 pl-9 pr-4 rounded border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-slate-900 dark:border-slate-600"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Buscar produtos"
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
                <th className="py-3 px-4 font-medium">SKU</th>
                <th className="py-3 px-4 font-medium">Categoria</th>
                <th className="py-3 px-4 font-medium">Preço</th>
                <th className="py-3 px-4 font-medium">Estoque</th>
                <th className="py-3 px-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-4 font-medium">{product.name}</td>
                  <td className="py-3 px-4 text-slate-600">{product.sku || '—'}</td>
                  <td className="py-3 px-4 text-slate-600">{product.category || '—'}</td>
                  <td className="py-3 px-4">{product.price ? `R$ ${product.price.toLocaleString('pt-BR')}` : '—'}</td>
                  <td className="py-3 px-4">{product.stock ?? '—'}</td>
                  <td className="py-3 px-4">
                    <Badge variant={statusBadge[product.status] || 'default'}>{product.status}</Badge>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Nenhum produto encontrado.
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
