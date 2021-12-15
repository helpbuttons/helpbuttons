import { of } from 'rxjs';
import { alertService } from 'services/Alert';

export const errorService = {
    handle,
};

// enable subscribing to alerts observable
function handle(error) {

  console.error(error);

  if(error.response && error.response.error && error.response.error.details ) {

    alertService.error(error.response.error.details[0].message);

  } else if (error.response && error.response.error && error.response.error.message) {

    alertService.error(error.response.error.message);

  } else {

    alertService.error('Fatal Error: ' + error);

  }

  return of(error);

}
