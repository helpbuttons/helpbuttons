//EXPLORE MAP
import React, {useState} from "react";

//services
import { userService } from 'services/Users';
import ButtonDataService from "services/Buttons";
import { authenticationService } from 'services';

//components
import Map from "components/map/LeafletMap";
import List from "components/list/List";
import NavHeader from "components/nav/NavHeader"; //just for mobile

export default function Explore() {

  const [showLeftColumn, setShowLeftColumn] = useState(true);

  const onchange = (data) => {
      setShowLeftColumn(!showLeftColumn);
  }

  return (

        <div className="index__container">
          <div className={'index__content-left ' + (showLeftColumn ? '' : 'index__content-left--hide')}>
            <NavHeader showSearch={showLeftColumn}/>
            <List showLeftColumn={showLeftColumn} onchange={(e) => { onchange(e) }}  />
          </div>
          <Map />
        </div>

  );
}
