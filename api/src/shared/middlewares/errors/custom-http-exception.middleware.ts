import { HttpException, HttpStatus } from "@nestjs/common";
import { ErrorName, errorsList } from "@src/shared/types/errorsList";

export class CustomHttpException extends HttpException{
    constructor(response: ErrorName){
        const errors = errorsList.filter(({name}) => name == response);
        if (errors.length > 0)
            super(errors[0].name, errors[0].status)
        else
            super(response, HttpStatus.INTERNAL_SERVER_ERROR)
    }
}