import { NextFunction, Request, Response } from 'express';

const validate =
  (schema: any) => (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      res.status(400).send({
        error: {
          status: 400,
          message: error?.details?.[0]?.message.replace(/"/g, ''),
        },
      });
    } else {
      next();
    }
  };

export default validate;
