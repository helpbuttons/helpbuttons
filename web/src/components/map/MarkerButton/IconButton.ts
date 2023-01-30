import L from 'leaflet';
import { makeImageUrl } from 'shared/sys.helper';
function MarkerButton(markerImage, markerType, markerCaption) {
  markerImage = makeImageUrl(markerImage,'/api/');
  return L.divIcon({
      className: 'marker-button',
      html:(
            `<figure id='markerButton' class="marker-button marker-button--${ markerType }">
                    <div class="avatar-medium marker-button__image">
                      <img src="${markerImage}"
                        alt="${markerCaption} " title="${markerCaption}" class="picture__img"/>
                    </div>

                    <span class="marker-button__arrow"></span>

                    <div class="marker-button__tags marker-button__tags--${ markerType }">
                        <div class="marker-button__link-tag">
                          ${ markerCaption }
                        </div>
                    </div>
              </figure>`

            ),
      iconSize: [30, 42],
      iconAnchor: [15, 42],
  });
}

function MarkerIcon(title = '', markerImage = '') {
  markerImage = makeImageUrl(markerImage, '/api/');
  return L.divIcon({
      className: 'marker-button',
      html:(

            `<figure id='markerButton' class="marker-button marker-button--need">
                    <div class="avatar-medium marker-button__image">
                    <img src="${markerImage}"
                         alt="${title}"
                         class="picture__img"/>
                    </div>

                    <span class="marker-button__arrow"></span>

                    <div class="marker-button__tags marker-button__tags--need">
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

export { MarkerButton, MarkerIcon };
