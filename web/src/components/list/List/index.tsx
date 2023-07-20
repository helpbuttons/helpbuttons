//List of elements component that can be used in home, profile and other pages/layouts where we need to ddisplay buttons/networks/other elements
//a foreach => buttons
import React from 'react';
import { IoChevronForwardOutline } from 'react-icons/io5';
import { IoChevronBackOutline } from 'react-icons/io5';
import ContentList from 'components/list/ContentList';
import { ShowDesktopOnly } from 'elements/SizeOnly';
import { ShowMobileOnly } from 'elements/SizeOnly';

function List({
  onLeftColumnToggle,
  buttons,
  showLeftColumn,
  showFiltersForm,
  showListFullHeight,
  onFullHeightToggle,
}) {

  const handleChange = (event) => {

    console.log(showLeftColumn + " " + showListFullHeight)
    if(showLeftColumn && !showListFullHeight){

       return onFullHeightToggle(true);
    }

    if(showLeftColumn && showListFullHeight ){
       onFullHeightToggle(false);
      return onLeftColumnToggle(false);
   }

    if(!showLeftColumn && !showListFullHeight)
    return onLeftColumnToggle(true);


  }


  let [numberButtons, setNumberButtons] = React.useState(5);
  const handleScroll = (e) => {
    
    const edge = e.target.scrollWidth - e.target.scrollLeft === e.target.clientWidth;
    if (edge) { 
      setNumberButtons((prevValue) => { 
        const newValue = prevValue + 2 
        if (newValue < buttons.length)
          return newValue
        return prevValue
      })
    }
  }

  return (
    <>
      {!showFiltersForm && (
        <>
          <div
            className={
              (showListFullHeight ? ' list__container--vertical' : ' list__container')
            }
          >
            <div
                onClick={handleChange}
                className={
                  'drag-tab ' + (showLeftColumn ? '' : 'drag-tab--open') 
                }
              >
                <span className="drag-tab__line"></span>
                <div className="drag-tab__icon">
                  {showLeftColumn ? (
                    <IoChevronBackOutline />
                  ) : (
                    <IoChevronForwardOutline />
                  )}
                </div>
            </div>

            <div className={  (showListFullHeight ? 'list__content--vertical' : ' list__content')  } onScroll={handleScroll}>
              <ContentList buttons={buttons.slice(0, numberButtons)} />
            </div>

          </div>
        </>
      )}
    </>
  );
}

export default List;