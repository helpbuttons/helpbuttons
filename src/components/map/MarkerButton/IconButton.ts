import L from 'leaflet';
import CrossIcon from '../../../../public/assets/svg/icons/cross1.tsx'

const iconButton = L.divIcon({
      className: 'marker-button',
      html:(

            `<figure id='markerButton' class="marker-button marker-button--need">
                    <div class="avatar-medium marker-button__image">
                      <img src="https://dummyimage.com/100/#ccc/fff" alt="Avatar" class="picture__img"/>
                    </div>

                    <span class="marker-button__arrow"></span>

                    <div class="marker-button__tags marker-button__tags--need">
                        <div class="marker-button__link-tag">
                          tag
                        </div>
                    </div>
              </figure>`

            ),
      iconSize: [30, 42],
      iconAnchor: [15, 42]
  });


export { iconButton };
