import { Sun, Zap } from 'lucide-react';

export const FormHeader = () => {
  return (
    <header className="text-center mb-10 pt-8">
      {/* Logo Area */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-solar-gradient flex items-center justify-center shadow-solar animate-float">
            <Sun className="w-9 h-9 text-primary-foreground" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-eco-green flex items-center justify-center">
            <Zap className="w-3 h-3 text-primary-foreground" />
          </div>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
        <span className="text-solar">RENDSOLAR</span>
      </h1>
      <p className="text-lg text-muted-foreground max-w-xl mx-auto">
        Formulário de Cadastro para Energia Solar Fotovoltaica
      </p>

      {/* Companies */}
      <div className="flex items-center justify-center gap-6 mt-6">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted">
          <Sun className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Sentinela Energia Solar</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted">
          <Zap className="w-4 h-4 text-eco-green" />
          <span className="text-sm font-medium">RendSolar</span>
        </div>
      </div>

      {/* Progress indicator placeholder */}
      <div className="mt-8 max-w-md mx-auto">
        <div className="progress-bar">
          <div className="progress-fill w-1/3" />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Preencha todas as informações para continuar
        </p>
      </div>
    </header>
  );
};
