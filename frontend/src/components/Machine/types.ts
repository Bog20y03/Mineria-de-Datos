import type { StationId } from '../../services/recorridoService';

export type { StationId };

export type StationStatus = 'completada' | 'activa' | 'procesando' | 'pendiente';

export interface PiecePayload {
  tipo: 'consulta' | 'documentos' | 'dataset_script' | 'graficas_metricas' | 'latex' | 'sustentacion';
  label: string;
  sublabel: string;
  badge?: string;
}

export interface ProductionStep {
  station: StationId;
  pieza: PiecePayload;
}
