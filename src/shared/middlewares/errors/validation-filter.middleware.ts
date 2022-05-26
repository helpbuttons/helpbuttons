import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter } from "@nestjs/common";

export class ValidationException extends BadRequestException {
    constructor(public validationErrors: any) {
        super();
    }
}

@Catch(ValidationException)
export class ValidationFilter implements ExceptionFilter {
    catch(exception: ValidationException, host: ArgumentsHost): any {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        return response.status(400).json({
            statusCode: 400,
            success: false,
            message: 'Error validating the data of the form',
            validationErrors: exception.validationErrors
        });
    }
}

// {"statusCode":400,"message":"Bad Request Exception"}