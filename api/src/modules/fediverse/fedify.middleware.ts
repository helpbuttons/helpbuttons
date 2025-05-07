import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { FediverseService } from '@src/modules/fediverse/fediverse.service';

import { Request, Response, NextFunction } from 'express';

@Injectable()
export class FedifyMiddleware implements NestMiddleware {
  constructor(private readonly fediverseService: FediverseService)
  {

  }
  use(
    request: Request,
    response: Response,
    next: NextFunction,
  ): void {
    const t = this.fediverseService.findUser('id');
    console.log(t)
    next()

    // return federation.fetch(request, {
    //   contextData: contextDataFactory(request),

    //   // If the `federation` object finds a `request` not responsible for it
    //   // (i.e., not a federation-related request), it will call the `next`
    //   // provided by the web framework to continue the request handling by
    //   // the web framework:
    //   onNotFound: async (request) => await next(request),

    //   // Similar to `onNotFound`, but slightly more tickly one.
    //   // When the `federation` object finds a `request` not acceptable type-wise
    //   // (i.e., a user-agent doesn't want JSON-LD), it will call the `next`
    //   // provided by the web framework so that it renders HTML if there's some
    //   // page.  Otherwise, it will simply respond with `406 Not Acceptable`.
    //   // This trick enables the Fedify and the web framework to share the same
    //   // routes and they do content negotiation depending on `Accept` header:
    //   onNotAcceptable: async (request) => {
    //     const response = await next(request);
    //     if (response.status !== 404) return response;
    //     return new Response("Not Acceptable", {
    //       status: 406,
    //       headers: {
    //         "Content-Type": "text/plain",
    //         Vary: "Accept"
    //       },
    //     })
    //   }

    // response.on('finish', () => {
      
    // });

    // response.on('close', () => {
      
    // });
    // next();
  }
}
