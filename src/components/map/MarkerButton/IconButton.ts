import L from 'leaflet';
import CrossIcon from '../../../../public/assets/svg/icons/cross1.tsx'

const iconButton = new L.Icon({
    iconUrl: require('../../../../public/assets/svg/icons/cross1.tsx'),
    // iconRetinaUrl: require('components/map/MarkerButton'),
    // iconAnchor: null,
    // popupAnchor: null,
    // shadowUrl: null,
    // shadowSize: null,
    // shadowAnchor: null,
    iconSize: new L.Point(60, 75),
    className: 'marker-button'
});


export { iconButton };
