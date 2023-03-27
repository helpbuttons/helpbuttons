import { Draggable, Point } from 'pigeon-maps';
import React from 'react'
import { makeImageUrl } from 'shared/sys.helper';

export function MarkerButton({ width = 100, height = 95, color = 'red', title = 'something', image = 'unknown.png'}: { width: number; height: number, color: string, title: string, image: any}): JSX.Element {
    
  const markerImage = makeImageUrl(image, '/api/');
    
  return (
    <>
    
    <img src={markerImage} width={width} height={height}/>
   
    </>
  )
}

 {/* <svg
      width={width}
      height={height}
      viewBox="50 431 439 415"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <defs />
      <g
     id="layer1">
    <ellipse
       style="opacity:0.403;vector-effect:none;fill:#ffffff;fill-opacity:1;stroke:#0f0101;stroke-width:4.8;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1"
       id="path815"
       cx="88.446426"
       cy="144.29762"
       rx="40.82143"
       ry="38.55357" />
    <image
       y="73.238091"
       x="46.113087"
       id="image860"
       href={markerImage}
       preserveAspectRatio="none"
       height="86.178574"
       width="86.178574"
       clip-path="url(#clipPath878)"
       transform="matrix(0.93981482,0,0,0.93981482,4.7261019,34.645941)" /> 
  </g>
    </svg> */}


{
    /* import L from 'leaflet';
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
  
  export { MarkerIcon }; */
  }