import { Point } from "pigeon-maps";
import { buttonTypes } from "shared/buttonTypes";

export interface ButtonFilters {
    helpButtonTypes: string[];
    query: string;
    where: { address: string; center: Point; radius: number };
  }
  
  export const defaultFilters: ButtonFilters = {
    helpButtonTypes: buttonTypes.map(btnType => btnType.name),
    query: '',
    where: { address: null, center: null, radius: 10 },
  };