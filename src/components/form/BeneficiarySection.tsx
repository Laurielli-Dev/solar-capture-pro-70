import { Plus, Trash2, Users } from 'lucide-react';
import { AddressFields, type AddressData } from './AddressFields';
import { FileUpload } from './FileUpload';
import { type CompressedFile } from '@/lib/imageCompression';

export interface Beneficiary {
  id: string;
  nome: string;
  address: AddressData;
  files: CompressedFile[];
}

interface BeneficiarySectionProps {
  beneficiaries: Beneficiary[];
  onBeneficiariesChange: (beneficiaries: Beneficiary[]) => void;
}

const createEmptyAddress = (): AddressData => ({
  cep: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
});

const createEmptyBeneficiary = (): Beneficiary => ({
  id: crypto.randomUUID(),
  nome: '',
  address: createEmptyAddress(),
  files: [],
});

export const BeneficiarySection = ({
  beneficiaries,
  onBeneficiariesChange,
}: BeneficiarySectionProps) => {
  const addBeneficiary = () => {
    onBeneficiariesChange([...beneficiaries, createEmptyBeneficiary()]);
  };

  const removeBeneficiary = (id: string) => {
    onBeneficiariesChange(beneficiaries.filter((b) => b.id !== id));
  };

  const updateBeneficiary = (id: string, updates: Partial<Beneficiary>) => {
    onBeneficiariesChange(
      beneficiaries.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
  };

  return (
    <div className="space-y-6">
      {beneficiaries.map((beneficiary, index) => (
        <div
          key={beneficiary.id}
          className="beneficiary-card animate-fade-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-sky-blue/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-sky-blue" />
              </div>
              <h4 className="font-semibold text-foreground">
                Beneficiário {index + 1}
              </h4>
            </div>
            <button
              type="button"
              onClick={() => removeBeneficiary(beneficiary.id)}
              className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Nome */}
            <div>
              <label className="form-label">
                Nome do Beneficiário <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="Nome completo"
                value={beneficiary.nome}
                onChange={(e) =>
                  updateBeneficiary(beneficiary.id, { nome: e.target.value })
                }
                required
              />
            </div>

            {/* Endereço */}
            <div className="pt-2">
              <h5 className="text-sm font-medium text-muted-foreground mb-3">
                Endereço do Beneficiário
              </h5>
              <AddressFields
                prefix={`benef_${index + 1}`}
                address={beneficiary.address}
                onAddressChange={(address) =>
                  updateBeneficiary(beneficiary.id, { address })
                }
                required
              />
            </div>

            {/* Upload de Conta de Energia */}
            <div className="pt-4">
              <FileUpload
                label="Conta de Energia do Beneficiário"
                fieldName={`benef_${index + 1}_conta`}
                files={beneficiary.files}
                onFilesChange={(files) =>
                  updateBeneficiary(beneficiary.id, { files })
                }
                required
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addBeneficiary}
        className="w-full py-4 rounded-xl border-2 border-dashed border-sky-blue/40 
                 hover:border-sky-blue hover:bg-sky-blue/5 transition-all duration-300
                 flex items-center justify-center gap-3 text-sky-blue font-medium"
      >
        <Plus className="w-5 h-5" />
        Adicionar Beneficiário
      </button>
    </div>
  );
};
