export const verifyAndCompressFile = async (file: File, maxSize: number): Promise<File> => {
  if (file.size <= maxSize) {
    return file;
  }

  // Se il file è troppo grande, restituisci un errore
  throw new Error(`File troppo grande (max ${Math.round(maxSize/1024/1024)}MB). Per file più grandi, contattaci.`);
}; 