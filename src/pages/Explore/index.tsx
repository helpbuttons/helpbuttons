//EXPLORE MAP

//services
import { userService } from 'services/Users';
import ButtonDataService from "services/Buttons";
import { authenticationService } from 'services';

//components
import Map from "components/map/LeafletMap";
import List from "components/list/List";
import NavHeader from "components/nav/NavHeader"; //just for mobile

export default function Explore() {

  return (

        <div className="index__container">
          <NavHeader />
          <Map />
          <List />
        </div>

  );
}
