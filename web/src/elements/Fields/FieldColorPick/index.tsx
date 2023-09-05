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
      hideBoilerPlate = false,
    },
    ref,
  ) => {
    const [stateColor, setStateColor] = useState(null);
    const [showHideMenu, setHideMenu] = useState(false);
    const deboungBgColor = useDebounce(stateColor, 50);
    const setColor = (color) => {
      setStateColor(() => color);
    };

    useEffect(() => {
      if (deboungBgColor) {
        setValue(name, deboungBgColor);
      }
    }, [deboungBgColor]);

    return (
      <div className="form__field">
          <input
            name={name}
            ref={ref}
            placeholder={placeholder ? placeholder : label}
            onChange={onChange}
            onBlur={onBlur}
            className={`form__input ${classNameInput} ${
              validationError ? 'validation-error' : ''
            }`}
            value={value}
            type="hidden"
        />
        {showHideMenu && (
          <HexColorPicker
            color={value}
            onChange={(color) => setColor(color)}
          />
        )}
        <FieldError validationError={validationError} />
        {hideBoilerPlate && (
          <>
            <p className="form__label">{label}</p>
            <p className="form__explain">{explain}</p>
          </>
        )}
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

export const CircleColorPick = React.forwardRef(
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
      hideBoilerPlate = false,
    },
    ref,
  ) => {
    const [stateColor, setStateColor] = useState(null);
    const [showHideMenu, setHideMenu] = useState(false);
    const deboungBgColor = useDebounce(stateColor, 50);
    const setColor = (color) => {
      setStateColor(() => color);
    };

    useEffect(() => {
      if (deboungBgColor) {
        setValue(name, deboungBgColor);
      }
    }, [deboungBgColor]);

    return (
      // <div className="form__field">
          <HexColorPicker
            className='picker__content'
            color={value}
            onChange={(color) => setColor(color)}
          />
    );
  },
);