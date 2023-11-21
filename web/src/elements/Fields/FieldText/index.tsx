import React, { useState } from "react";
import FieldError from "../FieldError";
import t from "i18n";

interface IFieldText {
    label: string,
    handleChange: Function,
    name: string,
    validationError: any,
    classNameInput?: string,
    placeholder?: string,
    multiInput?: boolean,
    // subInputLink: string
}

const FieldText = React.forwardRef(({
    label,
    name,
    classNameInput,
    placeholder,
    onChange,
    onBlur,
    validationError,
    multiInput=false,
    value,
    explain,
    extraMessage,
    maxLength = -1,
    // subInputLink,
    // subInputLinkText
}, ref): IFieldText => {
    const [textLength, setTextLength] = useState(0);
    const onInput = (obj) => {
        if (maxLength > 0){
            if ( obj.target.value.length > maxLength) {
                obj.target.value = obj.target.value.slice(0, maxLength)
            }
            setTextLength(obj.target.value.length)
        } 
    }
    return (
        <div 
            className={
                'form__field ' +
                (multiInput ? 'form__field--noMargin' : '')
                }
        >
            {label && <label className="form__label">{label}</label>}
            {explain && 
                <p className="form__explain">{explain}</p>
            }
            <input
                name={name} 
                ref={ref}
                type="text"
                placeholder={ placeholder ? placeholder : label}
                onChange={onChange}
                onBlur={onBlur}
                className={`form__input ${classNameInput} ${validationError ? 'validation-error' : ''}`} 
                value={value}
                onInput={onInput}
            />
            <div className="form__input-subtitle">

                <div className="form__input-subtitle-side">
                    {maxLength > 0 && 
                        <label className="form__input-subtitle--text">
                         {textLength} / {maxLength}
                        </label>
                    }
                    <label className="form__input-subtitle--error">
                        <FieldError validationError={validationError} extraMessage={extraMessage}/> 
                    </label>
                </div>
                
                {/* {subInputLink &&

                    <div className="form__input-subtitle-side">
                        <a href={subInputLink} className="form__input-subtitle--text link">
                            {subInputLinkText}
                        </a>
                    </div>
                } */}

            </div>

        </div>
    );
});

export default FieldText;

