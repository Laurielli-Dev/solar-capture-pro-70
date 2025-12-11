const MAX_IMAGE_DIMENSION = 4000;
const IMAGE_QUALITY = 0.7;

export interface CompressedFile {
  name: string;
  type: string;
  content: string; // base64
  size: number;
  field: string;
}

export const compressImage = (file: File): Promise<CompressedFile> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      // For non-image files (like PDF), just convert to base64
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve({
          name: file.name,
          type: file.type,
          content: base64,
          size: file.size,
          field: '',
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      let { width, height } = img;

      // Scale down if necessary
      if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
        if (width > height) {
          height = Math.round((height * MAX_IMAGE_DIMENSION) / width);
          width = MAX_IMAGE_DIMENSION;
        } else {
          width = Math.round((width * MAX_IMAGE_DIMENSION) / height);
          height = MAX_IMAGE_DIMENSION;
        }
      }

      canvas.width = width;
      canvas.height = height;

      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      // Convert to JPEG for better compression
      const base64 = canvas.toDataURL('image/jpeg', IMAGE_QUALITY).split(',')[1];
      
      resolve({
        name: file.name.replace(/\.[^.]+$/, '.jpg'),
        type: 'image/jpeg',
        content: base64,
        size: Math.round(base64.length * 0.75), // Approximate decoded size
        field: '',
      });
    };

    img.onerror = () => reject(new Error('Failed to load image'));

    const reader = new FileReader();
    reader.onload = () => {
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const processFile = async (file: File, fieldName: string): Promise<CompressedFile> => {
  const compressed = await compressImage(file);
  return {
    ...compressed,
    field: fieldName,
  };
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
};

export const calculateTotalPayloadSize = (files: CompressedFile[]): number => {
  return files.reduce((total, file) => total + file.content.length * 0.75, 0);
};

export const MAX_PAYLOAD_SIZE = 40 * 1024 * 1024; // 40MB
