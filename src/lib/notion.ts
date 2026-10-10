import { cache } from 'react';
import godsData from './gods-data.json';

export interface GodData {
  id: string;
  name: string;
  title: string;
  desc: string;
  tags: string[];
  image: string;
  poem?: string;
  birthday?: string;
  category: string;
}

export const getGodsData = cache(async (): Promise<GodData[]> => {
  return godsData as GodData[];
});