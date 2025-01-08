import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';

interface ApiCustomOperationOptions {
  summary: string;
  bodyType?: any;
  responseStatus?: number;
  responseDescription?: string;
}

export function ApiCustomOperation(options: ApiCustomOperationOptions) {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    ApiOperation({ summary: options.summary })(target, key, descriptor);

    if (options.bodyType) {
      ApiBody({ type: options.bodyType })(target, key, descriptor);
    }

    if (options.responseStatus && options.responseDescription) {
      ApiResponse({
        status: options.responseStatus,
        description: options.responseDescription,
      })(target, key, descriptor);
    }
  };
}
