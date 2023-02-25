import { of } from 'rxjs';
import { isHttpError } from 'services/HttpService';
import { errorsList, ErrorText } from 'shared/types/error.list';
import { HttpStatus } from 'shared/types/http-status.enum';

export function handleError(onError, error) {
  const err = error.response;

  if (isHttpError(err)) {
    // do nothing, its ok! it will jump to the setup!
    const errorText: ErrorText[] = errorsList.filter(({ name, status }) => {
      return (err.message == name && err.statusCode == status);
    });
    if (errorText && errorText.length > 0) {
      onError(errorText[0].caption);
    } else {
      console.error(error)
      onError(error.message);
    }
  }
  return of(undefined);
}
