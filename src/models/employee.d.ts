import { Request } from 'express';

export declare namespace EMPLOYEE {
  interface MulterRequest extends Request {
    file: any;
  }
}
