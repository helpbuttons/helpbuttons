import LeafLetMap from "./index";

export default function MarkerSelectorMap({ markerPosition, onMarkerClick, initMapCenter, defaultZoom = 10, markerImage, markerCaption}) {
    return (
        <LeafLetMap center={initMapCenter} markerPosition={markerPosition} onMarkerClick={onMarkerClick} markerImage={markerImage} style={{ width: "90vw", height: "80vh" }} defaultZoom={defaultZoom} markerCaption={markerCaption} isMarkerSelector={true}
        onBoundsChange={(e) => {}}>
        </LeafLetMap>
    );
  }