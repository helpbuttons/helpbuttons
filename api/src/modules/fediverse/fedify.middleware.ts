import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { FediverseService } from '@src/modules/fediverse/fediverse.service';
import { createFederation, Federation, MemoryKvStore } from "@fedify/fedify";

import type {
  Request as ERequest,
  Response as EResponse,
  NextFunction,
} from "express";
@Injectable()
export class FedifyMiddleware implements NestMiddleware {
  private federation: Federation<any>;

  constructor(private readonly fediverseService: FediverseService) {
    this.federation = createFederation<string>({
      kv: new MemoryKvStore()
      // Omitted for brevity; see the related section for details.
    });
  }
  use(
    req: ERequest,
    res: Response,
    next: NextFunction,
  ): void {
    next()
}

}
    //   console.log('middleware')
    //   const request = fromERequest(req);
    //   const contextData = req;
    //   const contextDataPromise =
    //     contextData instanceof Promise
    //       ? contextData
    //       : Promise.resolve(contextData);
    //   contextDataPromise.then(async (contextData) => {
    //     let notFound = false;
    //     let notAcceptable = false;
    //     const response = await this.federation.fetch(request, {
    //       contextData,
    //       onNotFound: () => {
    //         // If the `federation` object finds a request not responsible for it
    //         // (i.e., not a federation-related request), it will call the `next`
    //         // function provided by the Express framework to continue the request
    //         // handling by the Express:
    //         notFound = true;
    //         next();
    //         return new Response("Not found", { status: 404 }); // unused
    //       },
    //       onNotAcceptable: () => {
    //         // Similar to `onNotFound`, but slightly more tricky.
    //         // When the `federation` object finds a request not acceptable
    //         // type-wise (i.e., a user-agent doesn't want JSON-LD), it will call
    //         // the `next` function provided by the Express framework to continue
    //         // if any route is matched, and otherwise, it will return a 406 Not
    //         // Acceptable response:
    //         notAcceptable = true;
    //         next();
    //         return new Response("Not acceptable", {
    //           status: 406,
    //           headers: {
    //             "Content-Type": "text/plain",
    //             Vary: "Accept",
    //           },
    //         });
    //       },
    //     });
    //     if (notFound || (notAcceptable && req.route != null)) return;
    //     // await setEResponse(res, response);
    //     // // Prevent the Express framework from sending the response again:
    //     // res.end();
    //     // res.status = () => res;
    //     // res.send = () => res;
    //     // res.end = () => res;
    //     // res.json = () => res;
    //     // res.removeHeader = () => res;
    //     // res.setHeader = () => res;
    //   });
    // };

  
// function fromERequest(req: ERequest): Request {
//   const url = `${req.protocol}://${req.header("Host") ?? req.hostname}${req.url}`;
//   const headers = new Headers();
//   for (const [key, value] of Object.entries(req.headers)) {
//     if (Array.isArray(value)) {
//       for (const v of value) headers.append(key, v);
//     } else if (typeof value === "string") {
//       headers.append(key, value);
//     }
//   }
//   return new Request(url, {
//     method: req.method,
//     headers,
//     // duplex: "half",
//     body:
//       req.method === "GET" || req.method === "HEAD"
//         ? undefined
//         : /*(Readable.toWeb(req))*/ undefined,
//   });
// }

// function setEResponse(res: EResponse, response: Response): Promise<void> {
//   res.status(response.status);
//   response.headers.forEach((value, key) => res.setHeader(key, value));
//   if (response.body == null) return Promise.resolve();
//   const body = response.body;
//   return new Promise((resolve) => {
//     const reader = body.getReader();
//     reader.read().then(function read({ done, value }) {
//       if (done) {
//         reader.releaseLock();
//         resolve();
//         return;
//       }
//       res.write(Buffer.from(value));
//       reader.read().then(read);
//     });
//   });
// }
