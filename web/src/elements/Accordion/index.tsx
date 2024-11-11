///Accordion section component for displaying long section data
import Btn, { BtnType, ContentAlignment, IconType } from "elements/Btn";
import React, {useEffect, useState} from "react";
import { IoAccessibility } from "react-icons/io5";


export default function Accordion({
    title,
    children,
    icon,
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
          <Btn
            btnType={BtnType.splitIcon}
            iconLink={icon}
            
            iconLeft={IconType.circle}
            caption={title}
            extraClass={classNames}
            contentAlignment={ContentAlignment.left}
            onClick={(e) => {e.preventDefault(); setShowChildren(!showChildren);handleClick()}}
          />
          {showChildren &&
            <div className="panel">
              {children}
            </div>
          }
        </>

    );
}
