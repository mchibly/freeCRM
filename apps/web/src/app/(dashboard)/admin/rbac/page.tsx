'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, Button, Badge } from '@/components/ui';
import { api } from '@/lib/api';
import { Plus, Shield } from 'lucide-react';

interface Role {
  id: string;
  name: string;
  label: string;
  description?: string;
  permissions: string[];
  isActive: boolean;
}

export default function RbacAdminPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/roles', { params: { limit: 50 } })
      .then((res) => setRoles(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Permissões (RBAC)</h1>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-1" /> Novo Perfil
        </Button>
      </div>

      {loading ? (
        <p className="text-slate-500">Carregando...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map((role) => (
            <Card key={role.id}>
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-5 h-5 text-brand-500" />
                <div>
                  <h3 className="font-semibold">{role.label}</h3>
                  <p className="text-xs text-slate-500">{role.name}</p>
                </div>
                <Badge variant={role.isActive ? 'success' : 'danger'} className="ml-auto">
                  {role.isActive ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
              {role.description && (
                <p className="text-sm text-slate-600 mb-3">{role.description}</p>
              )}
              <div className="flex flex-wrap gap-1">
                {role.permissions.slice(0, 5).map((perm) => (
                  <Badge key={perm} variant="default">{perm}</Badge>
                ))}
                {role.permissions.length > 5 && (
                  <Badge variant="default">+{role.permissions.length - 5}</Badge>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
