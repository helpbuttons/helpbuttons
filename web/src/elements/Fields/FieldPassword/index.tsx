import React, { useState } from "react";
import FieldError from "../FieldError";
import t from "i18n";

interface IFieldPassword {
    label: string,
    handleChange: Function,
    name: string,
    validationError: any,
    classNameInput?: string,
    placeholder?: string   
}

const FieldPassword = React.forwardRef(({
    label,
    name,
    classNameInput,
    placeholder,
    onChange,
    onBlur,
    validationError,
    explain,
}, ref): IFieldPassword => {

    const [showPassword, setShowPassword] = useState(false);
    
    return (
        <div className="form__field">
            {label &&  <label className="form__label">{label}</label>}
            {explain && <p className="form__explain">{explain}</p>}
            <input
                name={name}
                ref={ref}
                type={showPassword ? "text" : "password"}
                onChange={onChange}
                onBlur={onBlur}
                className={`form__input ${classNameInput} ${validationError ? 'validation-error' : ''}`} 
                placeholder={placeholder ? placeholder : label}
            />
            {/* <FieldError validationError={validationError}/> */}
            <div className="form__input-subtitle">

                <div className="form__input-subtitle-side">
                    <label className="form__input-subtitle--error">
                        <FieldError validationError={validationError}/> 
                    </label>
                </div>
                
                <div className="form__input-subtitle-side">
                    <div onClick={() => setShowPassword(!showPassword)} className="form__input-subtitle--text">
                        {t('user.showPassword')}
                    </div>
                </div>
                
            </div>
        </div>
    );
});

export default FieldPassword;
