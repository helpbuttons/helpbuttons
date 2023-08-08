///Accordion section component for displaying long section data
import React, {useState} from "react";


export default function Accordion({
    title,
    children,
}) {

  const [showChildren, setShowChildren] = useState(false);

  const classNames = showChildren ? 'accordion accordion--open' : 'accordion';

    return (
        <>
          <button id={title} className={classNames} onClick={(e) => {e.preventDefault(); setShowChildren(!showChildren)}}>{title}</button>
          {showChildren &&
            <div className="panel">
              {children}
            </div>
          }
        </>

    );
}
