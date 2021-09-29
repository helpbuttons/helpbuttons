import { Observable } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;
const tagSubject = new BehaviorSubject(process.browser && JSON.parse(localStorage.getItem('tag')));

//User services for all app
export class UserService {

  //Find model by tag
  public static findByTag(tag: Itag): Observable<any> {

      //save the ajax object that can be .pipe by the observable
      const userWithHeaders$ = ajax({

          url: baseUrl+"/users/findByTag"+tag.id.toString(),
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "accept": "application/json",
          },
          body: {
            "id": tag.id.toString(),
          },
      });

    return userWithHeaders$;

  }

  //Find array of tag model instances
  public static find(tag: Itag): Observable<any> {

      //save the ajax object that can be .pipe by the observable
      const userWithHeaders$ = ajax({

          url: baseUrl+"/users/tags",
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "accept": "application/json",
          },
          body: {

              "id": tag.id,
              "modelName": tag.modelName,
              "modelId": tag.modelId,
              "tagName": tag.tagName,

          },
      });

    return userWithHeaders$;

  }


}
