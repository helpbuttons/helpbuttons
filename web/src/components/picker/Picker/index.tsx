import React from "react";
import NextLink from "next/link";
import { IoClose } from "react-icons/io5";

import { useEffect, useRef } from "react";


export function Picker({ closeAction, headerText, children, extraClass = '' }) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closeAction();
      }
    };

    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [modalRef]);
  return (
    <>
      <div className="picker__close-container">
        <div ref={modalRef} className="picker--over picker picker-box-shadow picker__content picker__options-v">
          <div className="picker__header">
            <div className="picker__header-content">
              <div className="picker__header-left"></div>
              <div className="picker__header-center">
                <h1 className="picker__header-title">
                  {headerText}
                </h1>
              </div>
              <div className="picker__header-right">
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
