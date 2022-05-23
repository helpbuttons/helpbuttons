//this is the component integrated in buttonNewPublish to display the location. It shows the current location and has a button to change the location that displays a picker with the differents location options for the network
import React, {useState} from "react";

export default function Location({ exact, ...props }) {

  const [showHideMenu, setHideMenu] = useState(false);

  return (

    <>

      <div className="form__field">

        <div className="card-button__city card-button__everywhere" >
          {props.longitude}, {props.latitude}
        </div>

        <div className="btn" onClick={() => setHideMenu(!showHideMenu)}>
          Change place
        </div>

      </div>


    {showHideMenu &&

      <div className="picker__close-container">
        <div className="picker--over picker-box-shadow picker__content picker__options-v">
          <input name="latitude" type="text" value={props.latitude} onChange={(e) => props.setLatitude(e.target.value)}/>
          <input name="longitude" type="text" value={props.longitude} onChange={(e) => props.setLongitude(e.target.value)}/>
        </div>
        
        <div className="picker__close-overlay" onClick={() => setHideMenu(false)}></div>
      </div>

    }

    </>


  );
}
