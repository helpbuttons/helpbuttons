import { Observable } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

//TemplateButton services for all app
export class TemplateButtonService {

  //create templateButton
  public static new(data: ITemplateButton): Observable<any> {

      //save the ajax object that can be .pipe by the observable
      const templateButtonWithHeaders$ = ajax({

          url: baseUrl+"/templateButtons/new",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "accept": "application/json",
          },
          body: {

          },
      });

    return templateButtonWithHeaders$;

  }

  //add templateButton to networks
  public static addToNetworks(data: ITemplateButton): Observable<any> {

      //save the ajax object that can be .pipe by the observable
      const templateButtonWithHeaders$ = ajax({

          url: baseUrl+"/templateButtons/addToNetworks",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "accept": "application/json",
          },
          body: {

          },
      });

    return templateButtonWithHeaders$;

  }

  //EDIT templateButton
  public static edit(id:any, data: ITemplateButton): Observable<any> {

      //save the ajax object that can be .pipe by the observable
      const templateButtonWithHeaders$ = ajax({

          url: baseUrl+"/templateButtons/edit/"+id,
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "accept": "application/json",
          },
          body: {

          },
      });

    return templateButtonWithHeaders$;

  }

  //FIND templateButton
  public static find(data: ITemplateButton): Observable<any> {

      //save the ajax object that can be .pipe by the observable
      const templateButtonWithHeaders$ = ajax({

          url: baseUrl+"/templateButtons/find",
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "accept": "application/json",
          },
          body: {

          },
      });

    return templateButtonWithHeaders$;

  }

  //FIND templateButton BY ID
  public static findById(id:any): Observable<any> {

      //save the ajax object that can be .pipe by the observable
      const templateButtonWithHeaders$ = ajax({

          url: baseUrl+"/templateButtons/findById/"+id,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "accept": "application/json",
          },
          body: {

          },
      });

    return templateButtonWithHeaders$;

  }

  //delete templateButton
  public static _delete(id:any): Observable<any> {

      //save the ajax object that can be .pipe by the observable
      const templateButtonWithHeaders$ = ajax({

          url: baseUrl+"/templateButtons/delete/"+id,
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "accept": "application/json",
          },
          body: {

          },
      });

    return templateButtonWithHeaders$;

  }




}
