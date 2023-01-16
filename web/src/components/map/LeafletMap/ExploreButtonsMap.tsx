import LeafLetMap from './index';
export default function ExploreButtonsMap({
  initMapCenter,
  buttons,
  onBoundsChange,
  onMarkerClick = (button) => {},
  defaultZoom = 10,
}) {

  return (
    <LeafLetMap
      center={initMapCenter}
      markersButtons={buttons}
      onBoundsChange={onBoundsChange}
      onMarkerClick={onMarkerClick}
      defaultZoom={defaultZoom}
    ></LeafLetMap>
  );
}
