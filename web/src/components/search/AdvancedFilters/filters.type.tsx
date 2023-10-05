import { Point } from "pigeon-maps";
import { buttonTypes } from "shared/buttonTypes";

export interface ButtonFilters {
    helpButtonTypes: string[];
    query: string;
    where: { address: string; center: Point; radius: number };
    // tags: string[]
  }
  
  export const defaultFilters: ButtonFilters = {
    helpButtonTypes: [],
    query: '',
    where: { address: '', center: null, radius: 10 },
    // tags: []
  };