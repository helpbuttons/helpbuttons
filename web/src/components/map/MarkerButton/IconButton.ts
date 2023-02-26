import L from 'leaflet';
import { makeImageUrl } from 'shared/sys.helper';

function MarkerButtonImage({ markerImage, title }) {
  if (markerImage) {
    return `<img src="${markerImage}"
  alt="${title}"
  class="picture__img"/>`;
  } else {
    return ;
  }
}

function MarkerButtonTitle({ title }) {
  if (title)
  {
    return `
    <div class="marker-button__link-tag">
                            ${title}
                          </div>`;
  }
  return ;
  
}

function MarkerIcon(
  title = '',
  markerImage = '',
  markerColor = 'gray',
) {
  markerImage = makeImageUrl(markerImage, '/api/');
  if (!markerColor) {
    markerColor = 'gray';
  }

  return L.divIcon({
    className: 'marker-button',
    html: `<figure id='markerButton' class="marker-button marker-button-selector ${markerColor}">
                    <div class="avatar-medium marker-button__image">
                    <MarkerButtonImage markerImage={markerImage} title={title}/>
                    </div>

                    <span class="marker-button__arrow"></span>

                    <div class="marker-button__tags marker-button-selector-title ${markerColor}">
                      <MarkerButtonTitle title="${title}"/>
                    </div>
              </figure>`,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
  });
}

export { MarkerIcon };
