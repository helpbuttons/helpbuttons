///Accordion section component for displaying long section data
import React, {useState} from "react";


export default function Accordion({
    title,
    children,
}: BtnProps) {

  const [showChildren, setShowChildren] = useState(false);

    return (
        <>
          <button id={title} className="accordion" onClick={() => setShowChildren(!showChildren)}>{title}</button>
          {showChildren &&
            <div className="panel">
              {children}
            </div>
          }
        </>

    );
}
