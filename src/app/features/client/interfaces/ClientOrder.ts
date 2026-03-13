export interface ClientOrder {
  id: number;
  clientId: number;
  clientName: string;
  modelId: number;
  modelName: string;
  orderType: 'PURCHASE' | 'RENTAL' | string;
  createdAt: string;
  reservation_days: number;
  reservationDate: string | null;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | string;
}

