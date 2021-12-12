import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { protocol, method, originalUrl } = req;

    console.log(
      `Request URL: ${method} ${protocol}://${req.get('host')}${originalUrl}`,
    );
    // console.log(`Request headers: ${inspect(headers, { depth: null })}`);

    next();
  }
}
