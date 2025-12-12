/**
 * Utilitários para trabalhar com URLs de imagens
 */

/**
 * Verifica se uma URL é válida e pode ser renderizada
 */
export function isValidImageUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== 'string') return false;
  
  const trimmed = url.trim();
  if (trimmed === '') return false;
  
  // URLs HTTP/HTTPS são válidas
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return true;
  }
  
  // URLs base64 são válidas
  if (trimmed.startsWith('data:image/')) {
    return true;
  }
  
  // URIs locais (file://, content://, ph://) podem estar no banco mas não funcionam
  // quando vêm do backend. Vamos retornar false para forçar fallback
  if (trimmed.startsWith('file://') || 
      trimmed.startsWith('content://') || 
      trimmed.startsWith('ph://') ||
      trimmed.startsWith('assets-library://')) {
    // Se vier do banco (não é uma URI local do dispositivo atual), não funciona
    // Mas vamos tentar renderizar e deixar o onError tratar
    return false; // Força fallback para URIs locais do banco
  }
  
  return false;
}

/**
 * Normaliza uma URL de imagem, retornando null se inválida
 */
export function normalizeImageUrl(url: string | null | undefined): string | null {
  if (!isValidImageUrl(url)) return null;
  return url!.trim();
}

/**
 * Converte uma URI local para base64 (para upload)
 */
export async function convertImageToBase64(uri: string): Promise<string | null> {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Erro ao converter imagem para base64:', error);
    return null;
  }
}

