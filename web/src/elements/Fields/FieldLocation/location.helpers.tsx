import { useCallback } from 'react';
import debounce from 'lodash.debounce';
import { store } from 'state';
import {
  GeoFindAddress,
  GeoReverseFindAddress,
} from 'state/Geo';

export const useGeoSearch = () => {
  const GeoFindByQuery = useCallback(
    debounce((query, lat, lon, limited, onSuccess, onError) => {
      store.emit(
        new GeoFindAddress(query, lat, lon, limited, (places) => {
          return onSuccess(places);
        }, (error) => onError(error)),
      );
    }, 50),
    [],
  );

  const _debounceFunc = (query, lat, lon, limited, success, error) => {
    GeoFindByQuery(query, lat, lon, limited, (places) => success(places), error);
  };

  return _debounceFunc;
};

export const useGeoReverse = () => {
  const GeofindReverse = useCallback(
    debounce((latLng, limited, success, onError) => {
      store.emit(
        new GeoReverseFindAddress(
          latLng[0],
          latLng[1],
          limited,
          (place) => {
            if (!place) {
              onError('place is null');
              return;
            }
            success(place);
          },
          (error) => {
            onError(error);
          },
        ),
      );
    }, 200),
    [],
  );

  const _debounceFunc = (latLng, limited, success, onError) => {
    GeofindReverse(latLng, limited, success, onError);
  };
  return _debounceFunc;
};
