export type SlideStatus = 'existing' | 'demolished' | 'unverified';

export interface ElephantSlide {
  id: string;
  nickname: string;
  city: string;
  location: string;
  status: SlideStatus;
  buildYear: number;
  material: string;
  coordinates: [number, number];
  description: string;
  imageUrl: string;
}
