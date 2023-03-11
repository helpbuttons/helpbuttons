import { Observable } from "rxjs";
import { httpService } from "services/HttpService";
import { MessageDto } from "shared/dtos/post.dto";

export class PostService {

  public static new(
    buttonId: string,
    data: MessageDto,
  ): Observable<any> {
    return httpService.post("/post/new/" + buttonId, data);
  }

}
