//EXPLORE MAP
import React, { useState, useEffect } from "react";

//services
import { ButtonService } from "services/Buttons";

//components
import { GetButtonsEvent } from 'pages/Explore/data.tsx';
import Map from "components/map/LeafletMap";
import List from "components/list/List";
import NavHeader from "components/nav/NavHeader"; //just for mobile

export default function Explore() {

  const [showLeftColumn, setShowLeftColumn] = useState(true);

  const onchange = (data) => {
      setShowLeftColumn(!showLeftColumn);
  }

  const [buttons, setButtons] = useState({
    btns: []
  })

  useEffect(() => {

    GetButtonsEvent(setButtons);

  }, [])

  return (

        <div className="index__container">
          <div className={'index__content-left ' + (showLeftColumn ? '' : 'index__content-left--hide')}>
            <NavHeader showSearch={showLeftColumn}/>
            <List buttons={buttons.btns} showLeftColumn={showLeftColumn} onchange={(e) => { onchange(e) }}  />
          </div>
          <Map buttons={buttons.btns}/>
        </div>

  );
}
