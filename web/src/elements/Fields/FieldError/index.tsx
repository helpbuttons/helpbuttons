import t from "i18n";

const fieldName = (validationError) => {
    return validationError.ref?.name ? validationError.ref.name : 'field' ;
}
export default function FieldError({
    validationError,
    extraMessage = ''
}) {
    let message = "";
    if (validationError) {
        if (validationError.message) {
            message = validationError.message;
        } else {
            switch (validationError.type) {
                case "required":
                    message = t('validation.fieldRequired' , [fieldName(validationError)]);
                    break;
                case "minLength":
                    message = t('validation.tooShort' , [fieldName(validationError)]);
                    break;
                // We can add more cases as we need them
            }
        }
   
    }
 if (extraMessage) {
            message += extraMessage
    }

    return (
        <>
             <div className="form__input-subtitle-side">
                {message && 
                            <label className="form__input-subtitle--error">
                                {message}
                            </label>
                }
              </div>

        </>
    );
}
