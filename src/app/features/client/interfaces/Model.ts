import { Media } from './Media';

export interface Model {
  id: number;
  name: string;
  description: string;
  purchasePrice: number;
  rentalPrice: number;
  creatorId: number;
  creatorName: string;
  available: boolean;
  mediaList: Media[];
}
