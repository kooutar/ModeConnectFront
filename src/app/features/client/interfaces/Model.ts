import { Media } from './Media';
import { Review } from './Review';

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
  reviews?: Review[];
}
