import { Observable } from 'rxjs';
import { ajax } from 'rxjs/ajax';

import { NetworkData } from './network.type';


export class NetworkDataService {


  //Create network
  public static create(data: INetwork, userId: any): Observable<any> {

      //save the ajax object that can be .pipe by the observable
      const networkWithHeaders$ = ajax({

          url: baseUrl+"/networks/new",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "accept": "application/json",
          },
          body: {


          },
      });

    return networkWithHeaders$;

  }

  //Edit network
  public static edit(data: INetwork): Observable<any> {

      //save the ajax object that can be .pipe by the observable
      const networkWithHeaders$ = ajax({

          url: baseUrl+"/networks/edit/"+id,
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "accept": "application/json",
          },
          body: {

          },

      });

    return networkWithHeaders$;

  }

  //Get networks
  public static find(id: any): Observable<any> {

      //save the ajax object that can be .pipe by the observable
      const networkWithHeaders$ = ajax({

          url: baseUrl+"/networks/find",
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "accept": "application/json",
          },
          body: {
          },
      });

    return networkWithHeaders$;

  }

  //Map networks
  public static map(data: INetwork): Observable<any> {

      //save the ajax object that can be .pipe by the observable
      const networkWithHeaders$ = ajax({

          url: baseUrl+"/networks/map",
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "accept": "application/json",
          },
          body: {
          },
      });

    return networkWithHeaders$;

  }

  //Get network by id
  public static findById(id: string): Observable<any> {

      //save the ajax object that can be .pipe by the observable
      const networkWithHeaders$ = ajax({

          url: baseUrl+"/networks/findById/"+id,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "accept": "application/json",
          },
          body: {
            "id":id,
          },
      });

    return networkWithHeaders$;

  }


    //Delete network
    public static _delete(id: any): Observable<any> {

        //save the ajax object that can be .pipe by the observable
        const networkWithHeaders$ = ajax({

            url: baseUrl+"/networks/delete/"+id,
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "accept": "application/json",
            },
            body: {
              "id":id,
            },
        });

      return networkWithHeaders$;

    }

    //Delete all networks
    public static deleteAll(id: any): Observable<any> {

        //save the ajax object that can be .pipe by the observable
        const networkWithHeaders$ = ajax({

            url: baseUrl+"/networks",
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "accept": "application/json",
            },
            body: {
              "id":id,
            },
        });

      return networkWithHeaders$;

    }



}
