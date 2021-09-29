import { Observable } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

//Tag services for all app
export class TagService {

  //Find model by tag
  public static findByTag(tag: ITag): Observable<any> {

      //save the ajax object that can be .pipe by the observable
      const tagWithHeaders$ = ajax({

          url: baseUrl+"/tags/findByTag"+tag.id.toString(),
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "accept": "application/json",
          },
          body: {
            "id": tag.id.toString(),
          },
      });

    return tagWithHeaders$;

  }

  //Find array of tag model instances
  public static find(tag: ITag): Observable<any> {

      //save the ajax object that can be .pipe by the observable
      const tagWithHeaders$ = ajax({

          url: baseUrl+"/tags/tags",
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "accept": "application/json",
          },
          body: {

              "id": tag.id,
              "modelName": tag.modelName,
              "modelId": tag.modelId,

          },
      });

    return tagWithHeaders$;

  }


}
