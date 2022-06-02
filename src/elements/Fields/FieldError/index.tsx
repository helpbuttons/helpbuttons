export default function FieldError({
    validationError
}) {
    return (
        <>
            {validationError && 
                <div className="form__input-subtitle">
                    <div className="form__input-subtitle-side">
                    <label className="form__input-subtitle--error">
                        {validationError}
                    </label>
                    </div>
                </div>
            }
        </>
    );
}
