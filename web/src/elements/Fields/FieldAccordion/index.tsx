///Accordion section component for displaying long section data
import Btn from "elements/Btn";
import React, {useEffect, useState} from "react";


export default function FieldAccordion({
    title,
    children,
    label,
    btnLabel,
    explain='',
    handleClick = () => {},
    collapsed = false,
    hideChildren
}) {

  const [showChildren, setShowChildren] = useState(collapsed);

  useEffect(() => {
    setShowChildren(() => collapsed)
  }, [collapsed])
  
  const classNames = showChildren ? 'accordion accordion--open' : 'accordion';

    return (
      <div className="form__field">
          <label className="form__label">{label}</label>
          <p className="form__explain">{explain}</p>
          <button id={title} className={classNames} onClick={(e) => {e.preventDefault(); setShowChildren(!showChildren);handleClick()}}>{btnLabel}</button>
          {/* <Btn
            classNameExtra={classNames}
            id={title}
            onClick={(e) => {e.preventDefault(); setShowChildren(!showChildren);handleClick()}}
            label={btnLabel}
          >
          </Btn> */}
          {showChildren &&
            <div className="panel">
              {children}
            </div>
          }
      </div>
    );
}
