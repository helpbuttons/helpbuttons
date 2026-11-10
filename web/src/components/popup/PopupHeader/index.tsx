///Header for popups, with cclose option and optional other elements
import { IoArrowBack, IoClose } from "react-icons/io5";
import Router from 'next/router';

export const doAction =(action)=> {
  if (action instanceof Function)
  {
    action()
  } else if (typeof action === "string") {
    Router.push(action)
  } else {
    console.log('wrong action ' + typeof action)
  }
}
export default function PopupHeader({children, linkBack = null,linkFwd = null}) {

  return (

    <>
      <div className="popup__header">
        <header className="popup__header-content">
          <div className="popup__header-left">
            {linkBack &&            
              <div onClick={()=>doAction(linkBack)} className="popup__header-button">
                <div className="popup__header-button__icon">
                  <IoArrowBack />
                </div>
              </div>           
            }
          </div>
          <div className="popup__header-center">
            <h1 className="popup__header-title">
              {children}
            </h1>
          </div>
          <div className="popup__header-right">
            {linkFwd &&
              <div onClick={()=>doAction(linkFwd)} className="popup__header-button">
                <div className="popup__header-button__icon">
                  <IoClose />
                </div>
              </div>
            }
          </div>
        </header>
      </div>

    </>

  );
}
