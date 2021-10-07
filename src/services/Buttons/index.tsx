import { Observable } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { IButton } from './button.type';

import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { store } from './index';
import { useRef } from '../../store/Store';


import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

export class ButtonService {

  //Create button
  public static new(data: IButton, token: string, networkId: string): Observable<any> {

      //save the ajax object that can be .pipe by the observable
      const buttonWithHeaders$ = ajax({

          url: baseUrl+"/buttons/new?networkId="+ networkId,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "accept": "application/json",
            "Authorization": "Bearer " + token,
          },
          body: {

            "name": data.name,
            "type": data.type,
            "tags": data.tags,
            "description": data.description,
            "geoPlace": JSON.parse(data.geoPlace),

          },
      });

    return buttonWithHeaders$;

  }

  //Edit button
  public static edit(data: IButton): Observable<any> {

      //save the ajax object that can be .pipe by the observable
      const buttonWithHeaders$ = ajax({

          url: baseUrl+"/buttons/edit/"+id,
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
