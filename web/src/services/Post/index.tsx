import { Observable } from "rxjs";
import { HttpService, httpService } from "services/HttpService";
import { MessageDto } from "shared/dtos/post.dto";
import { PrivacyType } from "shared/types/privacy.enum";

export class PostService {

  public static new(
    buttonId: string,
    data: MessageDto,
  ): Observable<any> {
    const formData = HttpService.toFormData(data, ['images']);
    return httpService.post("post/new/" + buttonId, formData);
  }

  public static findByButtonId(
    buttonId: string,
  ): Observable<any> {
    return httpService.get("post/findByButtonId/" + buttonId);
  }
  
  public static newComment(
    postId: string,
    data: MessageDto,
  ): Observable<any> {
    const formData = HttpService.toFormData(data, ['images']);
    return httpService.post(`post/new/comment/${postId}`, formData);
  }

  public static newCommentReply(
    postId: string,
    commentId: string,
    data: MessageDto,
  ): Observable<any> {
    const formData = HttpService.toFormData(data, ['images']);
    return httpService.post(`post/new/comment/${postId}/${commentId}`, formData);
  }

  public static delete(
    postId: string,
  ): Observable<any> {
    return httpService.delete("post/delete/" + postId);
  }

  public static deleteComment(
    commentId: string,
  ): Observable<any> {
    return httpService.delete("post/comment/delete/" + commentId);
  }
  
}
