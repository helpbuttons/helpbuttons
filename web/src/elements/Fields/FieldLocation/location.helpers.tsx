import { useCallback } from 'react';
import debounce from 'lodash.debounce';
import { store } from 'pages';
import {
  GeoFindAddress,
  GeoReverseFindAddress,
  emptyPlace,
} from 'state/Geo';

export const useGeoSearch = () => {
  const GeoFindByQuery = useCallback(
    debounce((latCenter, lngCenter, query, callback) => {
      store.emit(
        new GeoFindAddress(latCenter, lngCenter, query, (places) => {
          return callback(places);
        }),
      );
    }, 500),
    [],
  );

  const _debounceFunc = (latCenter, lngCenter, query, success) => {
    console.log(latCenter)
    GeoFindByQuery(latCenter, lngCenter, query, (places) => success(places));
  };

  return _debounceFunc;
};

export const useGeoReverse = () => {
  const GeofindReverse = useCallback(
    debounce((latLng, success) => {
      store.emit(
        new GeoReverseFindAddress(
          latLng[0],
          latLng[1],
          (place) => {
            success(place);
          },
          (error) => {
            success(emptyPlace({ lat: latLng[0], lng: latLng[1] }));
            console.log(error);
          },
        ),
      );
    }, 500),
    [],
  );

  const _debounceFunc = (latLng, success) => {
    GeofindReverse(latLng, success);
  };
  return _debounceFunc;
};
