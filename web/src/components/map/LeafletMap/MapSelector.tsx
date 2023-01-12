import LeafLetMap from "./index";

export default function MapSelector({ markerPosition, onMarkerClick = (e) => { console.log('clicked ' + e)}, initMapCenter, defaultZoom, markerImage, markerCaption}) {
    return (
        <LeafLetMap center={initMapCenter} markerPosition={markerPosition} onMarkerClick={onMarkerClick} markerImage={markerImage} style={{ width: "90vw", height: "80vh" }} defaultZoom={defaultZoom} markerCaption={markerCaption}>
        </LeafLetMap>
    );
  }