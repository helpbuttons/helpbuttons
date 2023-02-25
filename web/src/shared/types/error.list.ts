import { HttpStatus } from './http-status.enum';
export interface ErrorText {
    name: ErrorName,
    caption: string;
    status: number;
}

export enum ErrorName{
    NoButtonOwnerShip = 'no-button-ownership',
    NeedToBeRegistered = 'need-registered',
    CurrentPasswordWontMatch = 'current-password-mismatch',
    InvalidMimetype = 'invalid-mimetype',
    UnspecifiedInternalServerError = 'unspecified-nternal-server-error',
    EmailAlreadyRegistered = 'email-already-registered',
    UsernameAlreadyRegistered = 'username-already-registered'
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
    },
    {
        name: ErrorName.InvalidMimetype,
        caption: `We don't support this files yet please upload a jpeg or png`,
        status: HttpStatus.BAD_REQUEST
    },
    {
        name: ErrorName.UnspecifiedInternalServerError,
        caption: `Unspecified internal server error`,
        status: HttpStatus.INTERNAL_SERVER_ERROR
    },
    {
        name: ErrorName.EmailAlreadyRegistered,
        caption: `Email already registered`,
        status: HttpStatus.CONFLICT
    },
    {
        name: ErrorName.UsernameAlreadyRegistered,
        caption: `Username already registered`,
        status: HttpStatus.CONFLICT
    },
]
