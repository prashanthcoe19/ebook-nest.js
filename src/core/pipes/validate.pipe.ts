import { Injectable, ArgumentMetadata, BadRequestException, ValidationPipe, UnprocessableEntityException } from '@nestjs/common';

@Injectable()
export class ValidateInputPipe extends ValidationPipe {
    public async transform(value, metadata: ArgumentMetadata) {
        try {
            return await super.transform(value, metadata);
        } catch (e) {
            // Check if the error is an instance of BadRequestException
            if (e instanceof BadRequestException) {
                // If the error is a BadRequestException, throw an UnprocessableEntityException with the appropriate error message
                throw new UnprocessableEntityException(this.handleError(e.getResponse()));
            }

            // If it's not a BadRequestException, re-throw the error
            throw e;
        }
    }

    private handleError(errors) {
        // Parse the validation errors and return them
        return errors.message;
    }
}
