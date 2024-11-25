import React, { useEffect, useState } from 'react';
import FieldError from '../FieldError';
import { HexColorPicker } from 'react-colorful';
import t from 'i18n';
import { useDebounce } from 'shared/custom.hooks';
import { IoClose } from 'react-icons/io5';
import Btn, { BtnType, ContentAlignment, IconType } from 'elements/Btn';
export const FieldColorPick = React.forwardRef(
  (
    {
      label,
      actionName,
      name,
      classNameInput,
      placeholder,
      onChange,
      onBlur,
      validationError,
      value,
      explain,
      setValue,
    },
    ref,
  ) => {
    const [stateColor, setStateColor] = useState(null);
    const [showHideMenu, setHideMenu] = useState(false);
    const deboungBgColor = useDebounce(stateColor, 50);
    const [valueStore, setValueStore] = useState(value); // Declare 
    const setColor = (color) => {
      setStateColor(() => color);
    };

    useEffect(() => {
      if (deboungBgColor) {
        setValue(name, deboungBgColor);
      }
    }, [deboungBgColor]);

    const onChanged = (e) => {setValueStore(e.target.value); onChange(e)} 
    return (
      <div className="form__field">
          <input
            name={name}
            ref={ref}
            placeholder={placeholder ? placeholder : label}
            onChange={onChanged}
            onBlur={onBlur}
            className={`form__input ${classNameInput} ${
              validationError ? 'validation-error' : ''
            }`}
            value={valueStore}
            type="hidden"
        />
        {showHideMenu && (
          <HexColorPicker
            color={value}
            onChange={(color) => setColor(color)}
          />
        )}
        <FieldError validationError={validationError} />
        {label && <label className="form__label">{label}</label>}
        {explain && <p className="form__explain">{explain}</p>}
        <div
          className="btn"
          onClick={() => setHideMenu(!showHideMenu)}
        >
          {actionName}&nbsp;&nbsp;
          <span style={{ color: value }}>{value}</span>
          {showHideMenu && <IoClose />}
        </div>
 
      </div>
    );
  },
);