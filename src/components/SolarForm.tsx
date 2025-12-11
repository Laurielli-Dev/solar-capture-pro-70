import { useState } from 'react';
import { 
  User, 
  MapPin, 
  Users, 
  Home, 
  Send, 
  FileText, 
  IdCard,
  Zap,
  Phone,
  Mail,
  Loader2,
  CheckCircle
} from 'lucide-react';
import { FormHeader } from './form/FormHeader';
import { AddressFields, type AddressData } from './form/AddressFields';
import { FileUpload } from './form/FileUpload';
import { BeneficiarySection, type Beneficiary } from './form/BeneficiarySection';
import { RoofSection, type RoofData } from './form/RoofSection';
import { formatCpf, formatPhone } from '@/lib/cepService';
import { 
  calculateTotalPayloadSize, 
  MAX_PAYLOAD_SIZE, 
  formatFileSize,
  type CompressedFile 
} from '@/lib/imageCompression';
import { useToast } from '@/hooks/use-toast';

interface ClientData {
  nome: string;
  cpf: string;
  contato: string;
  email: string;
  amperagem: string;
  address: AddressData;
}

interface FormFiles {
  conta: CompressedFile[];
  cnh: CompressedFile[];
  disjuntor: CompressedFile[];
  telhado: CompressedFile[];
  disjuntorInstalacao: CompressedFile[];
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

const createEmptyClient = (): ClientData => ({
  nome: '',
  cpf: '',
  contato: '',
  email: '',
  amperagem: '',
  address: createEmptyAddress(),
});

const createEmptyRoof = (): RoofData => ({
  estruturas: [],
  tipos: [],
  descricao: '',
});

export const SolarForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [client, setClient] = useState<ClientData>(createEmptyClient());
  const [hasBeneficiary, setHasBeneficiary] = useState<'sim' | 'nao' | ''>('');
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [installationAddress, setInstallationAddress] = useState<AddressData>(createEmptyAddress());
  const [roofData, setRoofData] = useState<RoofData>(createEmptyRoof());
  
  const [files, setFiles] = useState<FormFiles>({
    conta: [],
    cnh: [],
    disjuntor: [],
    telhado: [],
    disjuntorInstalacao: [],
  });

  const updateFile = (field: keyof FormFiles, newFiles: CompressedFile[]) => {
    setFiles(prev => ({ ...prev, [field]: newFiles }));
  };

  const getAllFiles = (): CompressedFile[] => {
    const allFiles = [
      ...files.conta,
      ...files.cnh,
      ...files.disjuntor,
      ...files.telhado,
      ...files.disjuntorInstalacao,
    ];
    beneficiaries.forEach(b => allFiles.push(...b.files));
    return allFiles;
  };

  const validateForm = (): boolean => {
    if (!client.nome || !client.cpf || !client.contato || !client.email) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os dados do cliente",
        variant: "destructive",
      });
      return false;
    }

    if (hasBeneficiary === 'sim' && beneficiaries.length === 0) {
      toast({
        title: "Beneficiário obrigatório",
        description: "Adicione pelo menos um beneficiário",
        variant: "destructive",
      });
      return false;
    }

    if (roofData.estruturas.length === 0) {
      toast({
        title: "Estrutura obrigatória",
        description: "Selecione pelo menos uma estrutura de telhado",
        variant: "destructive",
      });
      return false;
    }

    if (roofData.tipos.length === 0) {
      toast({
        title: "Tipo de telha obrigatório",
        description: "Selecione pelo menos um tipo de telha",
        variant: "destructive",
      });
      return false;
    }

    const totalSize = calculateTotalPayloadSize(getAllFiles());
    if (totalSize > MAX_PAYLOAD_SIZE) {
      toast({
        title: "Tamanho excedido",
        description: `O total de arquivos (${formatFileSize(totalSize)}) excede o limite de 40MB`,
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simular envio (aqui seria a integração com Google Apps Script)
    const payload = {
      cliente: client,
      temBeneficiario: hasBeneficiary,
      beneficiarios: beneficiaries,
      enderecoInstalacao: installationAddress,
      telhado: roofData,
      arquivos: getAllFiles(),
    };

    console.log('Payload do formulário:', payload);

    // Simular delay de envio
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSuccess(true);

    toast({
      title: "Formulário enviado!",
      description: "Seus dados foram enviados com sucesso.",
    });

    // Reset após 3 segundos
    setTimeout(() => {
      setIsSuccess(false);
      setClient(createEmptyClient());
      setHasBeneficiary('');
      setBeneficiaries([]);
      setInstallationAddress(createEmptyAddress());
      setRoofData(createEmptyRoof());
      setFiles({
        conta: [],
        cnh: [],
        disjuntor: [],
        telhado: [],
        disjuntorInstalacao: [],
      });
    }, 3000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="section-card max-w-md w-full text-center animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-eco-green/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-eco-green" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Enviado com Sucesso!</h2>
          <p className="text-muted-foreground">
            Seus dados foram recebidos e estão sendo processados.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <FormHeader />

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Seção 1: Dados do Cliente */}
          <section className="section-card animate-fade-in">
            <div className="section-header">
              <div className="section-icon">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Informações do Cliente</h2>
                <p className="text-sm text-muted-foreground">Dados pessoais e de contato</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Nome */}
              <div className="md:col-span-2">
                <label className="form-label">
                  Nome Completo <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Digite o nome completo"
                  value={client.nome}
                  onChange={(e) => setClient({ ...client, nome: e.target.value })}
                  required
                />
              </div>

              {/* CPF */}
              <div>
                <label className="form-label">
                  CPF <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    className="form-input pl-10"
                    placeholder="000.000.000-00"
                    value={client.cpf}
                    onChange={(e) => setClient({ ...client, cpf: formatCpf(e.target.value) })}
                    maxLength={14}
                    required
                  />
                </div>
              </div>

              {/* Contato */}
              <div>
                <label className="form-label">
                  Telefone <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="tel"
                    className="form-input pl-10"
                    placeholder="(00) 00000-0000"
                    value={client.contato}
                    onChange={(e) => setClient({ ...client, contato: formatPhone(e.target.value) })}
                    maxLength={15}
                    required
                  />
                </div>
              </div>

              {/* E-mail */}
              <div>
                <label className="form-label">
                  E-mail <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    className="form-input pl-10"
                    placeholder="email@exemplo.com"
                    value={client.email}
                    onChange={(e) => setClient({ ...client, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Amperagem */}
              <div>
                <label className="form-label">
                  Amperagem <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Zap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    className="form-input pl-10"
                    placeholder="Ex: 40A, 60A, 100A"
                    value={client.amperagem}
                    onChange={(e) => setClient({ ...client, amperagem: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Endereço do Cliente */}
            <div className="pt-4 border-t border-border">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Endereço do Cliente</h3>
              </div>
              <AddressFields
                address={client.address}
                onAddressChange={(address) => setClient({ ...client, address })}
                required
              />
            </div>

            {/* Uploads do Cliente */}
            <div className="pt-6 border-t border-border mt-6 space-y-6">
              <FileUpload
                label="Foto da Conta de Energia"
                fieldName="foto_conta"
                files={files.conta}
                onFilesChange={(f) => updateFile('conta', f)}
                required
              />
              
              <FileUpload
                label="CNH (Frente e Verso)"
                fieldName="foto_cnh"
                files={files.cnh}
                onFilesChange={(f) => updateFile('cnh', f)}
                required
              />
              
              <FileUpload
                label="Foto do Disjuntor"
                fieldName="foto_disjuntor"
                files={files.disjuntor}
                onFilesChange={(f) => updateFile('disjuntor', f)}
              />
              
              <FileUpload
                label="Fotos do Telhado"
                fieldName="foto_telhado"
                files={files.telhado}
                onFilesChange={(f) => updateFile('telhado', f)}
              />
            </div>
          </section>

          {/* Seção 2: Beneficiários */}
          <section className="section-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="section-header">
              <div className="section-icon" style={{ background: 'var(--gradient-sky)' }}>
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Beneficiários</h2>
                <p className="text-sm text-muted-foreground">Cadastro de beneficiários do sistema</p>
              </div>
            </div>

            {/* Pergunta */}
            <div className="mb-6">
              <label className="form-label mb-3">
                Tem Beneficiário? <span className="text-destructive">*</span>
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="hasBeneficiary"
                    value="sim"
                    checked={hasBeneficiary === 'sim'}
                    onChange={() => setHasBeneficiary('sim')}
                    className="w-5 h-5 text-primary"
                  />
                  <span className="font-medium">Sim</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="hasBeneficiary"
                    value="nao"
                    checked={hasBeneficiary === 'nao'}
                    onChange={() => {
                      setHasBeneficiary('nao');
                      setBeneficiaries([]);
                    }}
                    className="w-5 h-5 text-primary"
                  />
                  <span className="font-medium">Não</span>
                </label>
              </div>
            </div>

            {/* Lista de Beneficiários */}
            {hasBeneficiary === 'sim' && (
              <BeneficiarySection
                beneficiaries={beneficiaries}
                onBeneficiariesChange={setBeneficiaries}
              />
            )}
          </section>

          {/* Seção 3: Outras Informações */}
          <section className="section-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="section-header">
              <div className="section-icon" style={{ background: 'linear-gradient(135deg, hsl(var(--eco-green)) 0%, hsl(152 60% 55%) 100%)' }}>
                <Home className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Outras Informações</h2>
                <p className="text-sm text-muted-foreground">Local de instalação e detalhes do telhado</p>
              </div>
            </div>

            {/* Endereço de Instalação */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-eco-green" />
                <h3 className="font-semibold text-foreground">Endereço da Instalação</h3>
              </div>
              <AddressFields
                prefix="instalacao"
                address={installationAddress}
                onAddressChange={setInstallationAddress}
                required
              />
            </div>

            {/* Foto do Disjuntor da Instalação */}
            <div className="mb-8">
              <FileUpload
                label="Foto do Disjuntor (Local de Instalação)"
                fieldName="disjuntor_instalacao"
                files={files.disjuntorInstalacao}
                onFilesChange={(f) => updateFile('disjuntorInstalacao', f)}
              />
            </div>

            {/* Dados do Telhado */}
            <div className="pt-6 border-t border-border">
              <div className="flex items-center gap-2 mb-4">
                <Home className="w-5 h-5 text-eco-green" />
                <h3 className="font-semibold text-foreground">Informações do Telhado</h3>
              </div>
              <RoofSection data={roofData} onDataChange={setRoofData} />
            </div>
          </section>

          {/* Botão de Envio */}
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-solar min-w-[280px] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Enviar Formulário
                </>
              )}
            </button>
          </div>

          {/* Tamanho total dos arquivos */}
          {getAllFiles().length > 0 && (
            <p className="text-center text-sm text-muted-foreground">
              Total de arquivos: {getAllFiles().length} ({formatFileSize(calculateTotalPayloadSize(getAllFiles()))})
            </p>
          )}
        </form>
      </div>
    </div>
  );
};
