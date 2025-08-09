import { HttpException } from "@nestjs/common";
import { HttpStatus } from '@src/shared/types/http-status.enum.js';

import { ErrorName, errorsList } from "@src/shared/types/error.list.js";

export class CustomHttpException extends HttpException{
    constructor(errorName: ErrorName){
        const errors = errorsList.filter(({name}) => name == errorName);
        if (errors.length > 0){
            super(errors[0].name, errors[0].status)
        }
        else{
            console.log(`errorName not found ${errorName}` )
            super(errorName, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}