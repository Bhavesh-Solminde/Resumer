declare module "pdf-parse/lib/pdf-parse.js" {
  interface PdfData {
    numpages: number;
    numrender: number;
    info: Record<string, unknown>;
    metadata: Record<string, unknown> | null;
    text: string;
    version: string;
  }

  function pdf(dataBuffer: Buffer, options?: object): Promise<PdfData>;
  export default pdf;
}

declare module "streamifier" {
  import { Readable } from "stream";

  function createReadStream(buffer: Buffer): Readable;
  export { createReadStream };
}

declare module "bcrypt" {
  export function hash(data: string, saltOrRounds: number): Promise<string>;
  export function compare(data: string, encrypted: string): Promise<boolean>;
}
