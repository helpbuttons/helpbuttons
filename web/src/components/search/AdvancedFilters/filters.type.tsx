import { Point } from "pigeon-maps";

export interface ButtonFilters {
    helpButtonTypes: string[];
    query: string;
    where: { address: string; center: Point; radius: number };
    results: {count: number}
  }
  
  export const defaultFilters: ButtonFilters = {
    helpButtonTypes: [],
    query: null,
    where: { address: null, center: null, radius: null },
    results: {count: 0}
  };