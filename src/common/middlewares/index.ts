import { Injectable, ValidationError } from '@nestjs/common';
import { I18nValidationExceptionFilter } from 'nestjs-i18n';

@Injectable()
export class ValidationsErrorExceptionFilter extends I18nValidationExceptionFilter {
  constructor() {
    super({
      detailedErrors: true,
      responseBodyFormatter: (_, exception, formattedErrors) => {
        const errorMessages = (formattedErrors as ValidationError[]).flatMap(
          (error) => Object.values(error.constraints),
        );

        return {
          statusCode: exception.getStatus(),
          errorMessages: errorMessages,
        };
      },
    });
  }
}
