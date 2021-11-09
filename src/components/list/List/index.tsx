//List of elements component that can be used in home, profile and other pages/layouts where we need to ddisplay buttons/networks/other elements
//a foreach => buttons
import React, {useState} from "react";
import CardButtonList from "components/list/CardButtonList";
import Link from 'next/link'


function List(props) {

  const [showLeftColumn, setShowLeftColumn] = useState(true);

  const handleChange = event => {
      props.onchange(event.target.value);
  }

  return (
      <>

        <div className="list__container">

              <div className="drag-tab" onClick={handleChange}><span className="drag-tab__line"></span></div>

              <div className="list__content">

                  <div className="list__element">
                    <CardButtonList />
                  </div>
                  <div className="list__element">
                    <CardButtonList />
                  </div>
                  <div className="list__element">
                    <CardButtonList />
                  </div>

              </div>

        </div>

      </>
  );

}

export default List;
