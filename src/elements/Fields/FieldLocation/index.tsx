//this is the component integrated in buttonNewPublish to display the location. It shows the current location and has a button to change the location that displays a picker with the differents location options for the network
import React, { useState } from "react";
import FieldNumber from "../FieldNumber";
import FieldError from "../FieldError";
import "leaflet/dist/leaflet.css";

import Map from "components/map/LeafletMap";
import { useController } from "react-hook-form";
export default function FieldLocation({ validationErrors, initialLocation, control }) {
  const [showHideMenu, setHideMenu] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [radius, setRadius] = useState(1);
  const style = { width: "90vw", height: "80vh" };
  // const { field:latitude } = useController({ name: 'latitude' })
  const { field : fieldLatitude } = useController({ name: 'latitude', control })
  const { field : fieldLongitude } = useController({ name: 'longitude', control })

  const onClick = (e) => {

    setLatitude((previousValue) => {
      const newValue = e.coordinates[0];
      fieldLatitude.onChange(newValue);
      return newValue;
    })
    setLongitude((previousValue) => {
      const newValue = e.coordinates[1];
      fieldLongitude.onChange(newValue);
      return newValue;
    })
  };

  const title = latitude || longitude ? `${latitude}, ${longitude} (radius: ${radius} km) ` : "Where ?";

  return (
    <>
      <div className="form__field">
        <div className="card-button__city card-button__everywhere">
        {title}
        </div>
        <div className="btn" onClick={() => setHideMenu(!showHideMenu)}>
          Change place
        </div>
        {/* <FieldError validationError={validationErrors.latitude} />
        <FieldError validationError={validationErrors.longitude} />
        <FieldError validationError={validationErrors.radius} /> */}
      </div>

      {showHideMenu && (
        <div className="picker__close-container">
          <div className="picker--over picker-box-shadow picker__content picker__options-v">
            <Map addMarkerClick={onClick} initialLocation={initialLocation} style={style} />
          </div>

          <div
            className="picker__close-overlay"
            onClick={() => setHideMenu(false)}
          ></div>
        </div>
      )}
    </>
  );
}
