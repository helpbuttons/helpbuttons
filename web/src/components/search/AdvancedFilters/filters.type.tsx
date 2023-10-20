import { Point } from "pigeon-maps";

export interface ButtonFilters {
    helpButtonTypes: string[];
    query: string;
    where: { address: string; center: Point; radius: number };
    orderBy: string;
    // tags: string[]
  }
  
  export const defaultFilters: ButtonFilters = {
    helpButtonTypes: [],
    query: '',
    where: { address: '', center: null, radius: 10 },
    orderBy: 'date'
    // tags: []
  };