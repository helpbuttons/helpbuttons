
import LeafLetMap from "./index";
export default function MapButtons({ initMapCenter, buttons, onBoundsChange}) {
    return (
        <LeafLetMap center={initMapCenter} markersButtons={buttons} onBoundsChange={onBoundsChange}>
        </LeafLetMap>
    );
  }