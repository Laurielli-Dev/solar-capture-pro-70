import { useState, useCallback, useRef } from 'react';
import { Upload, X, FileText, Image as ImageIcon } from 'lucide-react';
import { compressImage, formatFileSize, type CompressedFile } from '@/lib/imageCompression';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  label: string;
  fieldName: string;
  maxFiles?: number;
  accept?: string;
  files: CompressedFile[];
  onFilesChange: (files: CompressedFile[]) => void;
  required?: boolean;
}

export const FileUpload = ({
  label,
  fieldName,
  maxFiles = 5,
  accept = 'image/*,application/pdf',
  files,
  onFilesChange,
  required = false,
}: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback(async (fileList: FileList) => {
    if (files.length + fileList.length > maxFiles) {
      alert(`Máximo de ${maxFiles} arquivos permitidos`);
      return;
    }

    setIsProcessing(true);
    const newFiles: CompressedFile[] = [];

    for (const file of Array.from(fileList)) {
      if (file.size > 10 * 1024 * 1024) {
        alert(`Arquivo ${file.name} excede o limite de 10MB`);
        continue;
      }

      try {
        const compressed = await compressImage(file);
        newFiles.push({
          ...compressed,
          field: fieldName,
        });
      } catch (error) {
        console.error(`Erro ao processar ${file.name}:`, error);
      }
    }

    onFilesChange([...files, ...newFiles]);
    setIsProcessing(false);
  }, [files, maxFiles, fieldName, onFilesChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }, [processFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  };

  return (
    <div className="space-y-3">
      <label className="form-label">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
        <span className="text-muted-foreground font-normal ml-2">
          ({files.length}/{maxFiles})
        </span>
      </label>

      <div
        className={cn(
          'file-drop-zone',
          isDragging && 'active',
          isProcessing && 'opacity-50 pointer-events-none'
        )}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple
          className="hidden"
          onChange={handleInputChange}
        />
        
        <div className="w-14 h-14 rounded-full bg-solar-orange-light flex items-center justify-center">
          <Upload className="w-6 h-6 text-primary" />
        </div>
        
        <div className="text-center">
          <p className="font-medium text-foreground">
            {isProcessing ? 'Processando...' : 'Arraste arquivos aqui'}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            ou clique para selecionar • Imagens e PDFs até 10MB
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
          {files.map((file, index) => (
            <div key={index} className="file-preview group">
              {file.type.startsWith('image/') ? (
                <img
                  src={`data:${file.type};base64,${file.content}`}
                  alt={file.name}
                  className="w-full h-24 object-cover"
                />
              ) : (
                <div className="w-full h-24 bg-muted flex flex-col items-center justify-center gap-2">
                  <FileText className="w-8 h-8 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground truncate max-w-full px-2">
                    {file.name}
                  </span>
                </div>
              )}
              
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-destructive text-destructive-foreground
                         opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="absolute bottom-0 left-0 right-0 bg-foreground/80 text-background text-xs px-2 py-1 truncate">
                {formatFileSize(file.size)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
