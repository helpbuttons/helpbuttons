import React, { useState } from "react";
import FieldError from "../FieldError";
import t from "i18n";
import { IoEye, IoEyeOff, IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

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
    onForgotPass,
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
            {showPassword &&
            <div className="form__input__pass-toggle form__input--location-loading" onClick={() => setShowPassword(!showPassword)}><IoEyeOffOutline/></div>}
            {!showPassword &&
            <div className="form__input__pass-toggle form__input--location-loading" onClick={() => setShowPassword(!showPassword)}><IoEyeOutline/></div>}

            <div className="form__input-subtitle">

                <div className="form__input-subtitle-side">
                    <FieldError validationError={validationError}/> 
                </div>
                <div className="form__input-subtitle-side">
                   {onForgotPass &&
                        <div onClick={onForgotPass} className="form__input-subtitle--text link">
                            {t('user.loginClick')}
                        </div>                   
                   }
                </div>
                
            </div>
        </div>
    );
});

export default FieldPassword;
