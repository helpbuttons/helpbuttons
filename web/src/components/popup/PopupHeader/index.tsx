///Header for popups, with cclose option and optional other elements
import { IoArrowBack, IoClose } from "react-icons/io5";
import { Link } from 'elements/Link';
import Router from 'next/router';
import dconsole from "shared/debugger";


export default function PopupHeader({children, linkBack = null,linkFwd = null}) {
  const onClick =(action)=> {
    if (action instanceof Function)
    {
      action()
    } else if (typeof action === "string") {
      Router.push(action)
    } else {
      dconsole.log('wrong action ' + typeof action)
    }
  }
  return (

    <>
      <div className="popup__header">
        <header className="popup__header-content">
          <div className="popup__header-left">
            {linkBack &&            
              <div onClick={()=>onClick(linkBack)} className="popup__header-button">
                <div className="btn-circle__icon">
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
              <div onClick={()=>onClick(linkFwd)} className="popup__header-button">
                <div className="btn-circle__icon">
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
