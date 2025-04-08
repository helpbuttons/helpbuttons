import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class HttpHelper {
  constructor(private readonly httpService: HttpService) {}

  get(url): Promise<any> {
    return this.httpService.axiosRef
      .get(encodeURI(url), {timeout: 15000})
      .catch((err) => {
        if (err.code === 'ECONNABORTED') {
          throw new HttpException(
            `Request timeout ${url}`,
            HttpStatus.BAD_GATEWAY,
          );
        }else{
          console.log(err);
          console.log('failed url ' + url);
          throw new HttpException(
            'Error requesting api ',
            HttpStatus.BAD_GATEWAY,
          );
        }
      });
  }
}
