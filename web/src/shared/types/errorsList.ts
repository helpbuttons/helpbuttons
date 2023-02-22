import {HttpStatus} from 'http-status'
const HttpStatusCodes = require('http-status');

export enum ErrorName{
    NoButtonOwnerShip = 'no-button-ownership',

}

export interface ErrorText {
    name: ErrorName,
    caption: string;
    status: HttpStatus;
}

export const errorsList: ErrorText[] = 
[
    {
        name: ErrorName.NoButtonOwnerShip,
        caption: `You don't have ownership of this button`,
        status: HttpStatusCodes.FORBIDDEN
    }
]
