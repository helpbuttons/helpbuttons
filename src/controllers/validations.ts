export enum TemplateButtonsTypes {
        need = 'need',
        exchange = 'exchange',
        offer = 'offer'
    }

const gjv = require("geojson-validation");
export class Validations{
        static isGeoPoint(point: object): boolean{
                return gjv.valid(point) && gjv.isPoint(point);
        }
}