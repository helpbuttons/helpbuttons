import { map, tap, take, catchError } from "rxjs/operators";
import { produce } from "immer";

import { WatchEvent } from "store/Event";
import { GlobalState } from "store/Store";
import Router from "next/router";

import { UserService } from "services/Users";
import { ButtonService } from "services/Buttons";
import IButton from "services/Buttons/types";
import { alertService } from "services/Alert";
import { errorService } from "services/Error";

//Called event for new user signup
export class CreateButtonEvent implements WatchEvent {
  public constructor(
    private button: IButton,
    private token: string,
    private networkId: string,
    private setValidationErrors
  ) {}
  public watch(state: GlobalState) {
    return ButtonService.new(this.button, this.token, this.networkId).pipe(
      tap((buttonData) => {
        alertService.info(
          "Has creado un botón" + buttonData.response.id.toString()
        );

        Router.push({ pathname: "/", state: state });
      }),
      catchError((error) => {
        if (error.response && error.response.validationErrors) {
          this.setValidationErrors(error.response.validationErrors);
        }
        return errorService.handle(error);
      })
    );
  }
}
