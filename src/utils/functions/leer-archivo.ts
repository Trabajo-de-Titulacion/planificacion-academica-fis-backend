import { readFileSync } from 'fs';

export const leerArchivo = (path: string) => {
  const buffer = readFileSync(path);
  const content = buffer.toString();
  return content;
};
