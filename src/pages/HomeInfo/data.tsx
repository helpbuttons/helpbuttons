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
