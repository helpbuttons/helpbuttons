export default function FieldError({
    validationError
}) {
    let message = "";
    if (validationError) {
        if (validationError.message) {
            message = validationError.message;
        } else {
            switch (validationError.type) {
                case "required":
                    message = "This field is required";
                    break;
                case "minLength":
                    message = "The value is too short";
                    break;
                // We can add more cases as we need them
            }
        }
    }

    return (
        <>
            {message && 
                <div className="form__input-subtitle">
                    <div className="form__input-subtitle-side">
                    <label className="form__input-subtitle--error">
                        {message}
                    </label>
                    </div>
                </div>
            }
        </>
    );
}
