// import { map, tap, take, catchError } from 'rxjs/operators';
// import { of } from 'rxjs';
// import { produce } from 'immer';
// import Router, { withRouter } from 'next/router';
//
// import { WatchEvent } from 'store/Event';
// import { GlobalState } from 'store/Store';
//
// import { UserService } from 'services/Users';
// import { IUser } from 'services/Users/types';
// import { HttpUtilsService } from "services/HttpUtilsService";
// import { alertService }  from 'services/Alert/index.ts';
//
//
// //Called event for login
// export class SearchLocationEvent implements WatchEvent {
//
//   public constructor(private input: string) {}
//   public watch(state: GlobalState) {
//     return UserService.login(this.email, this.password).pipe(
//       map(userData => userData),
//       take(1),
//       tap(userData => {
//         if(userData.response.token)
//         new HttpUtilsService().setAccessToken("user",userData.response.token);
//         Router.push({ pathname: '/', state: {} });
//       }),
//       catchError((error) => {
//         console.log("error: ", error.message);
//         if(error.response.error.details) {
//           alertService.error(error.response.error.details[0].message);
//         } else {
//           alertService.error(error.response.error.message);
//         }
//         return of(error);
//       }),
//     )
//   }
// }

import { map, tap, take, catchError } from 'rxjs/operators';

import { NetworkService } from 'services/Networks';
import { INetwork } from 'services/Networks/types';
import { alertService }  from 'services/Alert/index.ts';


 export function GetNetworksEvent (setNetworks) {

   // Anything in here is fired on component mount.
   let networks = NetworkService.find().subscribe(nets => {

     if (nets) {
         console.log(nets.response[0].geoPlace)
           // add message to local state if not empty
           setNetworks({ nets: [nets.response] });
       } else {
           // clear messages when empty message received
           setNetworks({ nets: [] });
       }

   });
   return () => {
       // Anything in here is fired on component unmount.
       btns.unsubscribe();
   }

 }
