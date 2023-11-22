import t from 'i18n';
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
    invalidDates = 'invalid-dates'
}

export const errorsList: ErrorText[] = 
[
    {
        name: ErrorName.NoOwnerShip,
        caption: t("user.ownership"),
        status: HttpStatus.FORBIDDEN
    },
    {
        name: ErrorName.NeedToBeRegistered,
        caption: t("validation.register"),
        status: HttpStatus.FORBIDDEN
    },
    {
        name: ErrorName.CurrentPasswordWontMatch,
        caption: t("validation.currenPass"),
        status: HttpStatus.NOT_ACCEPTABLE
    },
    {
        name: ErrorName.InvalidMimetype,
        caption: t("validation.supportFiles"),
        status: HttpStatus.BAD_REQUEST
    },
    {
        name: ErrorName.UnspecifiedInternalServerError,
        caption: t("validation.internalServer"),
        status: HttpStatus.INTERNAL_SERVER_ERROR
    },
    {
        name: ErrorName.EmailAlreadyRegistered,
        caption: t("validation.emailRegistered"),
        status: HttpStatus.CONFLICT
    },
    {
        name: ErrorName.UsernameAlreadyRegistered,
        caption: t("validation.userRagistered"),
        status: HttpStatus.CONFLICT
    },
    {
        name: ErrorName.nothingToDelete,
        caption: t("validation.delete"),
        status: HttpStatus.GONE
    },
    {
        name: ErrorName.validationError,
        caption: t("validation.invalidForm"),
        status: HttpStatus.BAD_REQUEST
    },
    {
        name: ErrorName.inviteOnly,
        caption: t("validation.inviteOnly"),
        status: HttpStatus.FORBIDDEN
    },
    {
        name: ErrorName.geoCodingError,
        caption: t("validation.address"),
        status: HttpStatus.BAD_GATEWAY
    },
    {
        name: ErrorName.invalidDates,
        caption: t("validation.dates"),
        status: HttpStatus.NOT_ACCEPTABLE
    },
]
