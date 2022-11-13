//List of elements component that can be used in home, profile and other pages/layouts where we need to ddisplay buttons/networks/other elements
//a foreach => buttons
import React, {useState} from "react";
import CardButtonList from "components/list/CardButtonList";
import { IoChevronForwardOutline } from "react-icons/io5";
import { IoChevronBackOutline } from "react-icons/io5";
import ContentList from "components/list/ContentList";
import Link from 'next/link'


function List(props) {

  const [showLeftColumn, setShowLeftColumn] = useState(true);

  const handleChange = event => {
      props.onchange(event.target.value);
      setShowLeftColumn(!showLeftColumn);
  }

  const buttons = props.buttons;

  return (
      <>

        <div onClick={handleChange} className={'drag-tab ' + (showLeftColumn ? '' : 'drag-tab--open')}>

          <span className="drag-tab__line"></span>

          <div className="drag-tab__icon">

            {showLeftColumn
              ? <IoChevronBackOutline />
              : <IoChevronForwardOutline />
            }

          </div>

        </div>

        <div className={'list__container ' + (showLeftColumn ? '' : 'list__container--hide')}>


        <div className="list__content">
          <ContentList buttons={buttons} />
              </div>

        </div>

      </>
  );

}

export default List;
