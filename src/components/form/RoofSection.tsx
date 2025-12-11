import { useState } from 'react';
import { Home, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface RoofData {
  estruturas: string[];
  tipos: string[];
  descricao: string;
}

interface RoofSectionProps {
  data: RoofData;
  onDataChange: (data: RoofData) => void;
}

const ESTRUTURAS = [
  { id: 'metalica', label: 'Metálica', icon: '🏗️' },
  { id: 'madeira', label: 'Madeira', icon: '🪵' },
  { id: 'concreto', label: 'Concreto', icon: '🧱' },
  { id: 'fibrocimento', label: 'Fibrocimento', icon: '🔲' },
  { id: 'colonial', label: 'Colonial', icon: '🏠' },
  { id: 'laje', label: 'Laje', icon: '⬜' },
];

const TIPOS = [
  { id: 'ceramica', label: 'Cerâmica', color: 'bg-orange-100 border-orange-300 text-orange-800' },
  { id: 'fibrocimento', label: 'Fibrocimento', color: 'bg-gray-100 border-gray-300 text-gray-800' },
  { id: 'metalico', label: 'Metálico', color: 'bg-slate-100 border-slate-300 text-slate-800' },
  { id: 'concreto', label: 'Concreto', color: 'bg-stone-100 border-stone-300 text-stone-800' },
  { id: 'vidro', label: 'Vidro', color: 'bg-blue-50 border-blue-300 text-blue-800' },
  { id: 'shingle', label: 'Shingle', color: 'bg-amber-100 border-amber-300 text-amber-800' },
];

export const RoofSection = ({ data, onDataChange }: RoofSectionProps) => {
  const toggleEstrutura = (id: string) => {
    const newEstruturas = data.estruturas.includes(id)
      ? data.estruturas.filter((e) => e !== id)
      : [...data.estruturas, id];
    onDataChange({ ...data, estruturas: newEstruturas });
  };

  const toggleTipo = (id: string) => {
    const newTipos = data.tipos.includes(id)
      ? data.tipos.filter((t) => t !== id)
      : [...data.tipos, id];
    onDataChange({ ...data, tipos: newTipos });
  };

  return (
    <div className="space-y-6">
      {/* Estruturas */}
      <div>
        <label className="form-label mb-3">
          Estrutura do Telhado <span className="text-destructive">*</span>
          <span className="text-muted-foreground font-normal ml-2">
            (selecione uma ou mais)
          </span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {ESTRUTURAS.map((estrutura) => (
            <button
              key={estrutura.id}
              type="button"
              onClick={() => toggleEstrutura(estrutura.id)}
              className={cn(
                'p-4 rounded-xl border-2 transition-all duration-200',
                'flex flex-col items-center gap-2 hover:scale-[1.02]',
                data.estruturas.includes(estrutura.id)
                  ? 'border-primary bg-solar-orange-light shadow-solar'
                  : 'border-border hover:border-primary/50'
              )}
            >
              <span className="text-2xl">{estrutura.icon}</span>
              <span className="font-medium text-sm">{estrutura.label}</span>
              {data.estruturas.includes(estrutura.id) && (
                <Check className="w-4 h-4 text-primary absolute top-2 right-2" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tipos */}
      <div>
        <label className="form-label mb-3">
          Tipo de Telha <span className="text-destructive">*</span>
          <span className="text-muted-foreground font-normal ml-2">
            (selecione uma ou mais)
          </span>
        </label>
        <div className="flex flex-wrap gap-2">
          {TIPOS.map((tipo) => (
            <button
              key={tipo.id}
              type="button"
              onClick={() => toggleTipo(tipo.id)}
              className={cn(
                'px-4 py-2 rounded-full border-2 transition-all duration-200',
                'font-medium text-sm hover:scale-105',
                data.tipos.includes(tipo.id)
                  ? `${tipo.color} border-current shadow-md`
                  : 'border-border bg-background hover:border-muted-foreground'
              )}
            >
              {tipo.label}
              {data.tipos.includes(tipo.id) && (
                <Check className="w-3 h-3 inline-block ml-1" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Descrição */}
      <div>
        <label className="form-label">
          Descrição Adicional do Telhado
        </label>
        <textarea
          className="form-input min-h-[100px] resize-y"
          placeholder="Descreva detalhes adicionais sobre o telhado, inclinação, orientação, etc."
          value={data.descricao}
          onChange={(e) => onDataChange({ ...data, descricao: e.target.value })}
        />
      </div>
    </div>
  );
};
