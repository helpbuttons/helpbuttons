import LeafLetMap from "./index";

export default function MapSelector({ markerPosition, onMarkerClick = (e) => { console.log('clicked ' + e)}, initMapCenter}) {
    return (
        <LeafLetMap center={initMapCenter} markerPosition={markerPosition} onMarkerClick={onMarkerClick} style={{ width: "90vw", height: "80vh" }}>
        </LeafLetMap>
    );
  }