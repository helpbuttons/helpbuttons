import React from "react";
import NextLink from "next/link";
import { IoClose } from "react-icons/io5";

///small popup to pick small data by the user
export function Picker({ closeAction, headerText, children, extraClass}) {
  return (
    <>
      <div className="picker__close-container">
        <div className="picker--over picker-box-shadow picker__content picker__options-v">
          <div  className="picker__header">
            <div  className="picker__header-content">
              <div  className="picker__header-left"></div>
              <div  className="picker__header-center">{headerText}</div>
              <div  className="picker__header-right">
                <a onClick={() => closeAction()} className="picker__header-button">
                  <div className="btn-circle__icon">
                    <IoClose />
                  </div>
                </a>
              </div>
            </div>
          </div>
          <div className={"picker__content " + extraClass}>
           {children}
          </div>
        </div>
      </div>
      <div
        className="picker__close-overlay"
        onClick={() => closeAction()}
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
