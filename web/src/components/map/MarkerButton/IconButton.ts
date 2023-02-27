import L from 'leaflet';
import { makeImageUrl } from 'shared/sys.helper';

function MarkerIcon(title = '', markerImage = '', markerColor = 'red') {
  markerImage = makeImageUrl(markerImage, '/api/');
  return L.divIcon({
      className: 'marker-button',
      html:(

            `<figure id='markerButton' class="marker-button marker-button-selector ${markerColor}">
                    <div class="avatar-medium marker-button__image">
                    <img src="${markerImage}"
                         alt="${title}"
                         class="picture__img"/>
                    </div>

                    <span class="marker-button__arrow"></span>

                    <div class="marker-button__tags marker-button-selector-title ${markerColor}">
                        <div class="marker-button__link-tag">
                          ${title}
                        </div>
                    </div>
              </figure>`

            ),
      iconSize: [30, 42],
      iconAnchor: [15, 42]
  });
}

export { MarkerIcon };
