import { Media } from './Media';
import { ReviewResponseDto } from '../services/review-service';

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
  reviews?: ReviewResponseDto[];
  averageRating?: number;
}
