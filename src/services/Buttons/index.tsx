import { Observable } from 'rxjs';
import { ajax } from 'rxjs/ajax';

import { Button } from './button.type';


export class ButtonDataService {

  //Create button
  public static create(data: IButton, userId: any): Observable<any> {

      //save the ajax object that can be .pipe by the observable
      const buttonWithHeaders$ = ajax({

          url: baseUrl+"/buttons/create",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "accept": "application/json",
          },
          body: {

            "name": data.name,
            "type": data.type,
            "tags": data.tags,
            "description": data.description,
            "geoPlace": data.geoPlace,
            "owner": userId,
            "templateButtonId": data.templateButtonId,

          },
      });

    return buttonWithHeaders$;

  }

  //Edit button
  public static update(data: IButton): Observable<any> {

      //save the ajax object that can be .pipe by the observable
      const buttonWithHeaders$ = ajax({

          url: baseUrl+"/buttons/update/"+id,
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "accept": "application/json",
          },
          body: {

            "name": data.name,
            "type": data.type,
            "tags": data.tags,
            "description": data.description,
            "geoPlace": data.geoPlace,
            "owner": data.owner,
            "templateButtonId": data.templateButtonId,
          },

      });

    return buttonWithHeaders$;

  }

  //Edit button
  public static addToNetworks(data: IButton): Observable<any> {

      //save the ajax object that can be .pipe by the observable
      const buttonWithHeaders$ = ajax({

          url: baseUrl+"/buttons/addToNetworks/"+id,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "accept": "application/json",
          },
          body: {

            "name": data.id,
            "networks": data.networks,

          },

      });

    return buttonWithHeaders$;

  }

  //Get buttons
  public static find(id: any): Observable<any> {

      //save the ajax object that can be .pipe by the observable
      const buttonWithHeaders$ = ajax({

          url: baseUrl+"/buttons",
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "accept": "application/json",
          },
          body: {
            "id":id,
          },
      });

    return buttonWithHeaders$;

  }

  //Get button by id
  public static findById(id: string): Observable<any> {

      //save the ajax object that can be .pipe by the observable
      const buttonWithHeaders$ = ajax({

          url: baseUrl+"/buttons/findById/"+id,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "accept": "application/json",
          },
          body: {
            "id":id,
          },
      });

    return buttonWithHeaders$;

  }


    //Delete button
    public static _delete(id: any): Observable<any> {

        //save the ajax object that can be .pipe by the observable
        const buttonWithHeaders$ = ajax({

            url: baseUrl+"/buttons/delete/"+id,
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "accept": "application/json",
            },
            body: {
              "id":id,
            },
        });

      return buttonWithHeaders$;

    }

    //Delete all buttons
    public static deleteAll(id: any): Observable<any> {

        //save the ajax object that can be .pipe by the observable
        const buttonWithHeaders$ = ajax({

            url: baseUrl+"/buttons",
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "accept": "application/json",
            },
            body: {
              "id":id,
            },
        });

      return buttonWithHeaders$;

    }


}
