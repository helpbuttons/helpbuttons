import React from "react";
import NextLink from "next/link";
import CrossIcon from "../../../../public/assets/svg/icons/cross1";

///small popup to pick small data by the user
export function Picker({ setHideMenu, onClosed, children }) {
  return (
    <>
      <div className="picker__close-container">
        <div className="picker--over picker-box-shadow picker__content picker__options-v">
          <a onClick={onClosed} className="popup__header-button">
            <div className="btn-circle__icon">
              <CrossIcon />
            </div>
          </a>
          {children}
        </div>
      </div>
      <div
        className="picker__close-overlay"
        onClick={() => setHideMenu(false)}
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
