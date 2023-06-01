//List of elements component that can be used in home, profile and other pages/layouts where we need to ddisplay buttons/networks/other elements
//a foreach => buttons
import React from "react";
import { IoChevronForwardOutline } from "react-icons/io5";
import { IoChevronBackOutline } from "react-icons/io5";
import ContentList from "components/list/ContentList";

function List({onLeftColumnToggle, buttons, showLeftColumn}) {

  const handleChange = event => {
      onLeftColumnToggle(event.target.value);
  }

  const helpButtons = buttons.slice(0,20)
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

          <span className="drag-tab__counter"></span>

        </div>

        <div className={'list__container ' + (showLeftColumn ? '' : 'list__container--hide')}>


          <div className="list__content">
            <ContentList buttons={helpButtons} />
          </div>

        </div>

      </>
  );

}

export default List;
