import { HttpStatus } from './http-status.enum.js';
export interface ErrorText {
    name: ErrorName,
    caption: string;
    status: number;
}

export enum ErrorName{
    NoButtonOwnerShip = 'no-button-ownership',
    NeedToBeRegistered = 'need-registered',
    CurrentPasswordWontMatch = 'current-password-mismatch'
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
    },
    {
        name: ErrorName.CurrentPasswordWontMatch,
        caption: `The "current password" you type is not correct`,
        status: HttpStatus.NOT_ACCEPTABLE
    }
]
