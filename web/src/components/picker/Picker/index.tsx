import React from "react";
import { IoClose } from "react-icons/io5";

import { useEffect, useRef } from "react";
import Btn, { BtnType, ContentAlignment, IconType } from "elements/Btn";
import t from "i18n";

const getEffectiveZIndex = (element: HTMLElement | null): number => {
  while (element) {
    const zIndex = window.getComputedStyle(element).zIndex;
    if (zIndex !== 'auto') {
      const parsed = parseInt(zIndex, 10);
      if (!isNaN(parsed)) {
        return parsed;
      }
    }
    element = element.parentElement;
  }
  return 0;
};

export function Picker({ closeAction, headerText, children, extraClass = '' }) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const clickedElement = event.target as HTMLElement;
      const pickerZIndex = getEffectiveZIndex(modalRef.current)
      const clickedElementZIndex = getEffectiveZIndex(clickedElement)
      if (modalRef.current && !modalRef.current.contains(event.target as Node) && pickerZIndex >= clickedElementZIndex) {
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
                <div onClick={() => closeAction()} className="picker__header-button">
                  <div className="picker__header-button__icon">
                    <IoClose />
                  </div>
                </div>
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


export function PickerConfirmation({ children = null, title, onCancel, onConfirmation }) {
  return (
    <Picker closeAction={onCancel} headerText={title}>
      {children}
      <div className="form__field--multiinput">
        <Btn
          btnType={BtnType.submit}
          iconLeft={IconType.svg}
          caption={t('common.confirm')}
          contentAlignment={ContentAlignment.center}
          onClick={onConfirmation}
        />
        <Btn
          btnType={BtnType.splitIcon}
          iconLeft={IconType.svg}
          caption={t('common.cancel')}
          contentAlignment={ContentAlignment.center}
          onClick={onCancel}
        />
      </div>
    </Picker>
  )
}