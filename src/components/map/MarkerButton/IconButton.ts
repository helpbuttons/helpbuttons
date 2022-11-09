import L from 'leaflet';

function iconButton(button) {
  return L.divIcon({
      className: 'marker-button',
      html:(

            `<figure id='markerButton' class="marker-button marker-button--${ button.type }">
                    <div class="avatar-medium marker-button__image">
                      <img src="https://picsum.photos/seed/${ button.id }/50/50"
                        alt="${ button.description }" title="${ button.description }" class="picture__img"/>
                    </div>

                    <span class="marker-button__arrow"></span>

                    <div class="marker-button__tags marker-button__tags--${ button.type }">
                        <div class="marker-button__link-tag">
                          ${ button.type }
                        </div>
                    </div>
              </figure>`

            ),
      iconSize: [30, 42],
      iconAnchor: [15, 42]
  });
}


function iconSelector() {
  return L.divIcon({
      className: 'marker-button',
      html:(

            `<figure id='markerButton' class="marker-button marker-button--need">
                    <div class="avatar-medium marker-button__image">
                    </div>

                    <span class="marker-button__arrow"></span>

                    <div class="marker-button__tags marker-button__tags--need">
                        <div class="marker-button__link-tag">
                          
                        </div>
                    </div>
              </figure>`

            ),
      iconSize: [30, 42],
      iconAnchor: [15, 42]
  });
}

export { iconButton, iconSelector };
