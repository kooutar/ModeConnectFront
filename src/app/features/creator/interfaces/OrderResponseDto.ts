export interface OrderResponseDto {
  id: number;
  clientId: number;
  clientName: string;
  modelId: number;
  modelName: string;
  orderType: string;
  createdAt: string;
  reservation_days: number;
  reservationDate: string | null;
  status: string;
}
