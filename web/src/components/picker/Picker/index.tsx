import React from "react";
import NextLink from "next/link";
import { IoClose } from "react-icons/io5";

///small popup to pick small data by the user
export function Picker({ closeAction, children }) {
  return (
    <>
      <div className="picker__close-container">
        <div className="picker--over picker-box-shadow picker__content picker__options-v">
          <a onClick={closeAction} className="popup__header-button">
            <div className="btn-circle__icon">
              <IoClose />
            </div>
          </a>
          {children}
        </div>
      </div>
      <div
        className="picker__close-overlay"
        onClick={closeAction}
      ></div>
    </>
  );
}

export function PickerSelector({ onHandleChange, label, value }) {
  const onClick = () => {
    onHandleChange(value);
  };
  return (
    <>
      <button className="picker__option-btn--active" type="button" name="btn">
        <div className="picker__option-btn--icon"></div>
        <div onClick={onClick} className="picker__option-btn--txt">
          {label}
        </div>
      </button>
    </>
  );
}
