//List of elements component that can be used in home, profile and other pages/layouts where we need to ddisplay buttons/networks/other elements
//a foreach => buttons
import React,{ useState } from 'react';
import { IoChevronForwardOutline } from 'react-icons/io5';
import { IoChevronBackOutline } from 'react-icons/io5';
import ContentList from 'components/list/ContentList';
import { useButtonTypes } from 'shared/buttonTypes';

function List({
  onLeftColumnToggle,
  buttons,
  showLeftColumn,
  showFiltersForm,
}) {
  const handleChange = (event) => {
    onLeftColumnToggle(event.target.value);
  };
  const [buttonTypes, setButtonTypes] = useState([]);
  useButtonTypes(setButtonTypes);
  let [numberButtons, setNumberButtons] = React.useState(5);
  const handleScrollWidth = (e) => {
    
    const edge = e.target.scrollWidth - e.target.scrollLeft === e.target.clientWidth;
    const edgeHeight = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (edge || edgeHeight) { 
      setNumberButtons((prevValue) => { 
        const newValue = prevValue + 2 
        if (newValue < buttons.length)
          return newValue
        return prevValue
      })
    }
  }

  const handleScrollHeight = (e) => {
    const edgeHeight = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (edgeHeight) { 
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
              'list__container '
            }
            onScroll={handleScrollHeight}
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

            <div className="list__content" onScroll={handleScrollWidth}>
              {buttonTypes?.length > 0 && 
              <ContentList buttons={buttons.slice(0, numberButtons)} buttonTypes={buttonTypes}/>
              }
            </div>

          </div>
        </>
      )}
    </>
  );
}

export default List;