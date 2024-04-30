import { HttpStatus } from './http-status.enum';
export interface ErrorText {
    name: ErrorName;
    caption: string;
    status: number;
}

export enum ErrorName{
    NoOwnerShip = 'no-ownership',
    NeedToBeRegistered = 'need-registered',
    CurrentPasswordWontMatch = 'current-password-mismatch',
    InvalidMimetype = 'invalid-mimetype',
    UnspecifiedInternalServerError = 'unspecified-nternal-server-error',
    EmailAlreadyRegistered = 'email-already-registered',
    UsernameAlreadyRegistered = 'username-already-registered',
    nothingToDelete = 'nothing-to-delete',
    validationError= 'validation-error',
    inviteOnly = 'invite-only-network',
    geoCodingError = 'geo-coding-error',
    invalidDates = 'invalid-dates',
    InvalidUsername = 'invalid-username',
    invalidEndDate = 'invalid-end-date'
}

export const errorsList: ErrorText[] = 
[
    {
        name: ErrorName.NoOwnerShip,
        caption: `You don't have ownership of this`,
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
    {
        name: ErrorName.nothingToDelete,
        caption: `Nothing to delete`,
        status: HttpStatus.GONE
    },
    {
        name: ErrorName.validationError,
        caption: `Error validating the form`,
        status: HttpStatus.BAD_REQUEST
    },
    {
        name: ErrorName.inviteOnly,
        caption: `Invite only network`,
        status: HttpStatus.FORBIDDEN
    },
    {
        name: ErrorName.geoCodingError,
        caption: `Error getting address`,
        status: HttpStatus.BAD_GATEWAY
    },
    {
        name: ErrorName.invalidDates,
        caption: `Invalid dates`,
        status: HttpStatus.NOT_ACCEPTABLE
    },
    {
        name: ErrorName.InvalidUsername,
        caption: `Invalid username`,
        status: HttpStatus.NOT_ACCEPTABLE
    },
    {
        name: ErrorName.invalidEndDate,
        caption: `End date is invalid`,
        status: HttpStatus.NOT_ACCEPTABLE
    },
]
