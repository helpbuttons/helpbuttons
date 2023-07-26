import { Observable } from "rxjs";
import { httpService } from "services/HttpService";
import { MessageDto } from "shared/dtos/post.dto";
import { CommentPrivacyOptions } from "shared/types/privacy.enum";

export class PostService {

  public static new(
    buttonId: string,
    data: MessageDto,
  ): Observable<any> {
    return httpService.post("/post/new/" + buttonId, data);
  }

  public static findByButtonId(
    buttonId: string,
  ): Observable<any> {
    return httpService.get("/post/findByButtonId/" + buttonId);
  }
  
  public static newComment(
    postId: string,
    privacy: CommentPrivacyOptions,
    data: MessageDto,
  ): Observable<any> {
    return httpService.post(`/post/new/comment/${privacy}/${postId}`, data);
  }

  public static delete(
    postId: string,
  ): Observable<any> {
    return httpService.delete("/post/delete/" + postId);
  }

  public static deleteComment(
    commentId: string,
  ): Observable<any> {
    return httpService.delete("/post/comment/delete/" + commentId);
  }
  
}
