'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, Button, Input } from '@/components/ui';
import { Palette, RotateCcw } from 'lucide-react';

const defaultTokens = {
  '--color-brand-500': '#3b82f6',
  '--color-brand-600': '#2563eb',
  '--color-brand-700': '#1d4ed8',
  '--radius': '0.5rem',
  '--font-sans': 'Inter',
};

export default function DesignSystemPage() {
  const [tokens, setTokens] = useState(defaultTokens);

  useEffect(() => {
    const saved = localStorage.getItem('ds-tokens');
    if (saved) {
      try {
        setTokens(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const updateToken = (key: string, value: string) => {
    const next = { ...tokens, [key]: value };
    setTokens(next);
    document.documentElement.style.setProperty(key, value);
    localStorage.setItem('ds-tokens', JSON.stringify(next));
  };

  const reset = () => {
    setTokens(defaultTokens);
    Object.entries(defaultTokens).forEach(([k, v]) =>
      document.documentElement.style.setProperty(k, v),
    );
    localStorage.removeItem('ds-tokens');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Design System</h1>
        <Button variant="outline" size="sm" onClick={reset}>
          <RotateCcw className="w-4 h-4 mr-1" /> Resetar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Colors */}
        <Card>
          <CardHeader>
            <CardTitle>Cores da Marca</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={tokens['--color-brand-500']}
                onChange={(e) => updateToken('--color-brand-500', e.target.value)}
                className="w-10 h-10 rounded cursor-pointer border-0"
                aria-label="Cor primária"
              />
              <div>
                <p className="text-sm font-medium">Cor Primária (500)</p>
                <p className="text-xs text-slate-500">{tokens['--color-brand-500']}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={tokens['--color-brand-600']}
                onChange={(e) => updateToken('--color-brand-600', e.target.value)}
                className="w-10 h-10 rounded cursor-pointer border-0"
                aria-label="Cor primária hover"
              />
              <div>
                <p className="text-sm font-medium">Cor Hover (600)</p>
                <p className="text-xs text-slate-500">{tokens['--color-brand-600']}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={tokens['--color-brand-700']}
                onChange={(e) => updateToken('--color-brand-700', e.target.value)}
                className="w-10 h-10 rounded cursor-pointer border-0"
                aria-label="Cor primária active"
              />
              <div>
                <p className="text-sm font-medium">Cor Active (700)</p>
                <p className="text-xs text-slate-500">{tokens['--color-brand-700']}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Typography & Radius */}
        <Card>
          <CardHeader>
            <CardTitle>Tipografia & Forma</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-1">Fonte</label>
              <select
                value={tokens['--font-sans']}
                onChange={(e) => updateToken('--font-sans', e.target.value)}
                className="w-full h-10 px-3 rounded border border-slate-300 text-sm dark:bg-slate-900 dark:border-slate-600"
                aria-label="Selecionar fonte"
              >
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Poppins">Poppins</option>
                <option value="system-ui">System UI</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Border Radius</label>
              <input
                type="range"
                min="0"
                max="1.5"
                step="0.125"
                value={parseFloat(tokens['--radius'])}
                onChange={(e) => updateToken('--radius', `${e.target.value}rem`)}
                className="w-full"
                aria-label="Ajustar border radius"
              />
              <p className="text-xs text-slate-500 mt-1">{tokens['--radius']}</p>
            </div>
          </div>
        </Card>

        {/* Preview */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <div className="flex flex-wrap gap-4 items-center">
            <Button>Botão Primário</Button>
            <Button variant="secondary">Secundário</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="danger">Danger</Button>
            <div className="w-48">
              <Input placeholder="Input de teste" label="Campo exemplo" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
