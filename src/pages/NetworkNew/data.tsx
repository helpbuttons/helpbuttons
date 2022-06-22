
import { NetworkService } from "services/Networks";
import Router from "next/router";
import { alertService } from "services/Alert";
import { errorService } from "services/Error";

export function createNewNetwork(network, token: string, setValidationErrors) {
  return NetworkService.create(network, token,
    (networkData) => {
      NetworkService.setSelectedNetworkId(networkData.response.id);
      
      alertService.info(
        "You have created a network" + networkData.response.id.toString()
      );
      
      Router.push("/");
    },
    (error) => {
    if (error.response && error.response.validationErrors) {
      setValidationErrors(error.response.validationErrors);
    }
    return errorService.handle(error);
    }
  );
}
