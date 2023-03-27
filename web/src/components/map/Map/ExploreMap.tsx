import React, { useEffect, useState } from 'react';
import { Draggable, Map, Marker } from 'pigeon-maps';
import { stamenTerrain } from 'pigeon-maps/providers';
import { AutoSizer } from 'react-virtualized';
import DebugToJSON from 'elements/Debug';
import { Button } from 'shared/entities/button.entity';
import Cluster from 'pigeon-cluster';
import { makeImageUrl } from 'shared/sys.helper';
import { MarkerCustom } from './MarkerCustom';
export default function ExploreMap({
  center,
  defaultZoom,
  markers,
  handleBoundsChange = (bounds) => {},
}) {
  const [mapZoom, setMapZoom] = useState(defaultZoom);
  const onBoundsChanged = ({ center, zoom, bounds, initial }) => {
    handleBoundsChange(bounds);
    setMapZoom(zoom);
  };

  return (
    <>

          <Map
            defaultCenter={center}
            defaultZoom={mapZoom}
            provider={stamenTerrain}
            onBoundsChanged={onBoundsChanged}
          >
            {markers.map((button: Button, idx) => (
              <MarkerCustom
                onClick={({ event, payload, anchor }) => {
                  console.log(
                    `Marker #${payload} clicked at: `,
                    anchor,
                  );
                }}
                key={idx}
                anchor={[button.latitude, button.longitude]}
                payload={button.id}
                image={makeImageUrl(button.image)}
              />
            ))}
          </Map>
    </>
  );
}

{
  /* <img
                        src={makeImageUrl(button.image, '/api/')}
                        width={40}
                        height={40}
                      />
                    </Marker> */
}

// {mapZoom < 0 ? ( // deactivate cluster for now.. set this as 10?
//               <Map
//                 //   ref={targetRef}
//                 defaultCenter={center}
//                 defaultZoom={mapZoom}
//                 provider={stamenTerrain}
//                 onBoundsChanged={onBoundsChanged}
//               >
//                 <Cluster>
//                   {markers.map((button: Button, idx) => (

//                     <Marker
//                       key={idx}
//                       anchor={[button.latitude, button.longitude]}
//                     >
//                       <img
//                         src={makeImageUrl(button.image, '/api/')}
//                         width={40}
//                         height={40}
//                       />
//                     </Marker>
//                   ))}
//                 </Cluster>
//               </Map>
//             ) : (
