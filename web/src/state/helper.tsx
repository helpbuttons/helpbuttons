import { of } from 'rxjs';
import { isHttpError } from 'services/HttpService';
import { errorsList, ErrorText } from 'shared/types/errorsList';
import { HttpStatus } from 'shared/types/http-status.enum';

export function handleError(onError, error) {
  const err = error.response;
  if (isHttpError(err) && err.statusCode === HttpStatus.FORBIDDEN) {
    // do nothing, its ok! it will jump to the setup!
    const errorText: ErrorText[] = errorsList.filter(({ name }) => {
      return err.message == name;
    });
    if (errorText && errorText.length > 0) {
      onError(errorText[0].caption);
    } else {
      onError(error.message);
    }
  }
  return of(undefined);
}
