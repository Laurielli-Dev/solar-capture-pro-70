import { useState, useCallback } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { fetchAddressByCep, formatCep } from '@/lib/cepService';

export interface AddressData {
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
}

interface AddressFieldsProps {
  prefix?: string;
  address: AddressData;
  onAddressChange: (address: AddressData) => void;
  required?: boolean;
}

export const AddressFields = ({
  prefix = '',
  address,
  onAddressChange,
  required = false,
}: AddressFieldsProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleCepChange = async (value: string) => {
    const formattedCep = formatCep(value);
    onAddressChange({ ...address, cep: formattedCep });

    const cleanCep = formattedCep.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      setIsLoading(true);
      const data = await fetchAddressByCep(cleanCep);
      setIsLoading(false);

      if (data) {
        onAddressChange({
          ...address,
          cep: formattedCep,
          logradouro: data.logradouro || '',
          bairro: data.bairro || '',
          cidade: data.localidade || '',
          estado: data.uf || '',
          complemento: data.complemento || address.complemento,
        });
      }
    }
  };

  const handleChange = (field: keyof AddressData, value: string) => {
    onAddressChange({ ...address, [field]: value });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* CEP */}
      <div className="relative">
        <label className="form-label">
          CEP {required && <span className="text-destructive">*</span>}
        </label>
        <div className="relative">
          <input
            type="text"
            className="form-input pr-10"
            placeholder="00000-000"
            value={address.cep}
            onChange={(e) => handleCepChange(e.target.value)}
            maxLength={9}
            required={required}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {isLoading ? (
              <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
            ) : (
              <Search className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
        </div>
      </div>

      {/* Logradouro */}
      <div className="md:col-span-2">
        <label className="form-label">
          Logradouro {required && <span className="text-destructive">*</span>}
        </label>
        <input
          type="text"
          className="form-input"
          placeholder="Rua, Avenida, etc."
          value={address.logradouro}
          onChange={(e) => handleChange('logradouro', e.target.value)}
          required={required}
        />
      </div>

      {/* Número */}
      <div>
        <label className="form-label">
          Número {required && <span className="text-destructive">*</span>}
        </label>
        <input
          type="text"
          className="form-input"
          placeholder="Nº"
          value={address.numero}
          onChange={(e) => handleChange('numero', e.target.value)}
          required={required}
        />
      </div>

      {/* Complemento */}
      <div>
        <label className="form-label">Complemento</label>
        <input
          type="text"
          className="form-input"
          placeholder="Apto, Bloco, etc."
          value={address.complemento}
          onChange={(e) => handleChange('complemento', e.target.value)}
        />
      </div>

      {/* Bairro */}
      <div>
        <label className="form-label">
          Bairro {required && <span className="text-destructive">*</span>}
        </label>
        <input
          type="text"
          className="form-input"
          placeholder="Bairro"
          value={address.bairro}
          onChange={(e) => handleChange('bairro', e.target.value)}
          required={required}
        />
      </div>

      {/* Cidade */}
      <div>
        <label className="form-label">
          Cidade {required && <span className="text-destructive">*</span>}
        </label>
        <input
          type="text"
          className="form-input"
          placeholder="Cidade"
          value={address.cidade}
          onChange={(e) => handleChange('cidade', e.target.value)}
          required={required}
        />
      </div>

      {/* Estado */}
      <div>
        <label className="form-label">
          Estado {required && <span className="text-destructive">*</span>}
        </label>
        <input
          type="text"
          className="form-input"
          placeholder="UF"
          value={address.estado}
          onChange={(e) => handleChange('estado', e.target.value)}
          maxLength={2}
          required={required}
        />
      </div>
    </div>
  );
};
