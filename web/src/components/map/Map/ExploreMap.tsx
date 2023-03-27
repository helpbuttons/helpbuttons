import React, { useEffect, useState } from 'react';
import { Draggable, Map, Marker } from 'pigeon-maps';
import { stamenTerrain } from 'pigeon-maps/providers';
import { AutoSizer } from 'react-virtualized';
import DebugToJSON from 'elements/Debug';
import { Button } from 'shared/entities/button.entity';
import Cluster from 'pigeon-cluster';
import { makeImageUrl } from 'shared/sys.helper';
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
      <AutoSizer>
        {({ width, height }) => (
          <>
            {mapZoom < 10 ? (
              <Map
                //   ref={targetRef}
                width={width}
                height={height}
                defaultCenter={center}
                defaultZoom={mapZoom}
                provider={stamenTerrain}
                onBoundsChanged={onBoundsChanged}
              >
                <Cluster>
                  {markers.map((button: Button, idx) => (
                    <Marker
                      key={idx}
                      anchor={[button.latitude, button.longitude]}
                    >
                      <img
                        src={makeImageUrl(button.image, '/api/')}
                        width={40}
                        height={40}
                      />
                    </Marker>
                  ))}
                </Cluster>
              </Map>
            ) : (
              <>
                <Map
                  //   ref={targetRef}
                  width={width}
                  height={height}
                  defaultCenter={center}
                  defaultZoom={mapZoom}
                  provider={stamenTerrain}
                  onBoundsChanged={onBoundsChanged}
                >
                  {markers.map((button: Button, idx) => (
                    <Marker
                      key={idx}
                      anchor={[button.latitude, button.longitude]}
                    >
                      <img
                        src={makeImageUrl(button.image, '/api/')}
                        width={40}
                        height={40}
                      />
                    </Marker>
                  ))}
                </Map>
              </>
            )}

          </>
        )}
      </AutoSizer>
    </>
  );
}