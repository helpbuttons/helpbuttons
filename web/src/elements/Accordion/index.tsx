///Accordion section component for displaying long section data
import React, {useEffect, useState} from "react";


export default function Accordion({
    title,
    children,
    handleClick = () => {},
    collapsed = false,
}) {

  const [showChildren, setShowChildren] = useState(collapsed);

  useEffect(() => {
    setShowChildren(() => collapsed)
  }, [collapsed])
  
  const classNames = showChildren ? 'accordion accordion--open' : 'accordion';

    return (
        <>
          <button id={title} className={classNames} onClick={(e) => {e.preventDefault(); setShowChildren(!showChildren);handleClick()}}>{title}</button>
          {showChildren &&
            <div className="panel">
              {children}
            </div>
          }
        </>

    );
}
