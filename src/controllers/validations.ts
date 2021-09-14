export enum TemplateButtonsTypes {
        need = 'need',
        exchange = 'exchange',
        offer = 'offer'
    }

const gjv = require("geojson-validation");
import { GeoJSON } from "geojson";

export class Validations{
        static isGeoPoint(point: object): boolean{
                return gjv.valid(point) && gjv.isPoint(point);
        }
        static isGeoPolygon(point: GeoJSON): boolean{
                return gjv.valid(point) && gjv.isPolygon(point);
        }
        
}