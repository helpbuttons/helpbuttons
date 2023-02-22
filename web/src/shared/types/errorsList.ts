import { HttpStatus } from './http-status.enum';
export interface ErrorText {
    name: ErrorName,
    caption: string;
    status: number;
}

export enum ErrorName{
    NoButtonOwnerShip = 'no-button-ownership',
    NeedToBeRegistered = 'need-registered'
}

export const errorsList: ErrorText[] = 
[
    {
        name: ErrorName.NoButtonOwnerShip,
        caption: `You don't have ownership of this button`,
        status: HttpStatus.FORBIDDEN
    },
    {
        name: ErrorName.NeedToBeRegistered,
        caption: `You need to be registered to use this functionality`,
        status: HttpStatus.FORBIDDEN
    }]
