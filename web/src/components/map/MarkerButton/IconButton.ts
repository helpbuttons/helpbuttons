import L from 'leaflet';
function MarkerButton(markerImage, markerType, markerCaption) {
  
  return L.divIcon({
      className: 'marker-button',
      html:(
            `<figure id='markerButton' class="marker-button marker-button--${ markerType }">
                    <div class="avatar-medium marker-button__image">
                      <img src="api/${markerImage}"
                        alt="${markerCaption}" title="${markerCaption}" class="picture__img"/>
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

function makeImageUrl(image) {

  const regex = /^data\:image/gm;
  return ( image.match(regex).length > 0 ? image : 'api/'+image )

}


function MarkerIcon(title = '', image = '') {
  image = makeImageUrl(image);
  console.log(image);
  return L.divIcon({
      className: 'marker-button',
      html:(

            `<figure id='markerButton' class="marker-button marker-button--need">
                    <div class="avatar-medium marker-button__image">
                    <img src="${image}"
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
