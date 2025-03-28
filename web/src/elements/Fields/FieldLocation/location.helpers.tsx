import { useCallback } from 'react';
import debounce from 'lodash.debounce';
import { store } from 'state';
import {
  GeoFindAddress,
  GeoReverseFindAddress,
  emptyPlace,
} from 'state/Geo';

export const useGeoSearch = () => {
  const GeoFindByQuery = useCallback(
    debounce((query, callback) => {
      store.emit(
        new GeoFindAddress(query, (places) => {
          return callback(places);
        }),
      );
    }, 500),
    [],
  );

  const _debounceFunc = (query, success) => {
    GeoFindByQuery(query, (places) => success(places));
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
