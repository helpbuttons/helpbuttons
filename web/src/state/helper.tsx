import { of } from 'rxjs';
import { isHttpError } from 'services/HttpService';
import { errorsList, ErrorText } from 'shared/types/error.list';

export function handleError(onError, error) {
  const err = error.response;
  let validationErrors = []
  if (isHttpError(err)) {
    // do nothing, its ok! it will jump to the setup!
    const errorText: ErrorText[] = errorsList.filter(({ name, status }) => {
      return (err.message == name && err.statusCode == status);
    });
    if (errorText && errorText.length > 0) {
      if(err.validationErrors)
      {
        validationErrors = err.validationErrors
      }
      console.error(`backend error: "${err.message}" [${err.statusCode}] `)
      onError({caption: errorText[0].caption, errorName: err.message, validationErrors});
    } else {
      console.error(`fatal error: could not find error "${err.message}" [${err.statusCode}] `)
      onError(error.message);
    }
  }
  return of(undefined);
}

export function setValidationErrors(validationErrors, setError) {
  if(validationErrors.length < 1)
  {
    return false;
  }
  Object.keys(validationErrors).forEach((validationError) => {
    setError(validationError, {
      type: 'custom',
      message: validationErrors[validationError][0],
    });
  });
};