export interface SourceRecord { id: string; estado: string; titulo: string; url: string; sha: string; fecha: string }
export interface SourcePacket { capturado_en: string; head: string; fuentes: SourceRecord[] }
export interface GateResult { ok: boolean; errores: string[]; registros: SourceRecord[]; borrador: string | null }
export const esquemaSeleccion: object;
export function controlarSeleccion(paquete: SourcePacket, salida: unknown): GateResult;
export function salidaConFallo(salida: string): string;
