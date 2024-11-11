import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { SetupDtoOut } from 'shared/entities/setup.entity';
import { GlobalState, store } from 'pages';
import { useStore } from 'store/Store';
import { roundCoords } from 'shared/honeycomb.utils';
import { useToggle } from 'shared/custom.hooks';
import {
  GeoFindAddress,
  GeoReverseFindAddress,
  emptyPlace,
} from 'state/Geo';
import t from 'i18n';
import Btn, {
  BtnType,
  ContentAlignment,
  IconType,
} from 'elements/Btn';
import { IoLocationOutline } from 'react-icons/io5';
import { LoadabledComponent } from 'components/loading';
import AsyncSelect from 'react-select/async';
import debounce from 'lodash.debounce';
import _ from 'lodash';
import { useGeoSearch } from 'elements/Fields/FieldLocation/location.helpers';

export default function DropDownSearchLocation({
  handleSelectedPlace = (place) => {},
  placeholder,
  label = '',
  explain = '',
  address = '',
  loadingNewAddress = false,
  hideAddress = false,
  toggleLoadingNewAddress,
  markerPosition,
}) {
  const config: SetupDtoOut = useStore(
    store,
    (state: GlobalState) => state.config,
  );

  const geoSearch = useGeoSearch()

  const setSelectedOption = (selectedOption) => {
    const selectedPlace = JSON.parse(selectedOption.value);
    setInput(() => address);
    handleSelectedPlace(selectedPlace);
  };

  const [loadingUserAddress, toggleLoadingUserAddress] =
    useState(false);

  const setCenterFromBrowser = () => {
    toggleLoadingUserAddress(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        store.emit(
          new GeoReverseFindAddress(
            position.coords.latitude,
            position.coords.longitude,
            (place) => {
              handleSelectedPlace(place);
              toggleLoadingUserAddress(false);
            },
            (error) => {
              toggleLoadingUserAddress(() => false);
              handleSelectedPlace(
                emptyPlace({
                  lat: position.coords.latitude.toString(),
                  lng: position.coords.longitude.toString(),
                }),
              );
              console.log(error);
            },
          ),
        );
      });
    }
  };
  interface SelectOption {
    readonly value: string;
    readonly label: string;
    readonly isFixed?: boolean;
    readonly isDisabled?: boolean;
  }
  const bounce = useRef(false);
  const options = useRef([]);
  const _loadSuggestions = function (input, callback) {
    toggleLoadingNewAddress(() => true);
    geoSearch(input, (places) => {
      toggleLoadingNewAddress(() => false);
      if (places.length > 0) {
        if (hideAddress) {
          options.current = _.uniqBy(places, 'label').map(
            (place, key) => {
              return {
                label: place.formatted_city,
                value: JSON.stringify(place),
                id: key,
              };
            },
          );
        } else {
          options.current = places.map((place, key) => {
            return {
              label: place.formatted,
              value: JSON.stringify(place),
              id: key,
            };
          });
        }
        
        bounce.current = false;
        toggleLoadingNewAddress(() => false);
        return callback(options.current);
      }
      return callback([]);
    });
  };
  const [input, setInput] = useState('');
  const debouncedFilter = useCallback(
    debounce(
      (inputValue, callback) =>
        _loadSuggestions(inputValue, callback),
      500,
    ),
    [],
  );
  const loadSuggestions = (inputValue, callback) => {
    debouncedFilter(inputValue, callback);
  };
  useEffect(() => {
    if (address) {
      setInput(() => address);
    }
  }, [address]);
  const handleFocus = (event) => {
    event.target.select();
  }

  return (
    <div className="form__field">
      <LoadabledComponent loading={loadingNewAddress}>
        <label className="form__label">
          {label}
          {label && address && (
            <>
              {' '}
              {address}
            </>
          )}
        </label>
      </LoadabledComponent>
      {explain && <div className="form__explain">{explain}</div>}
      <div className="form__field--location">
        <AsyncSelect
          inputValue={input}
          onInputChange={(value, action) => {
            //
            if (
              action?.action !== 'input-blur' &&
              action?.action !== 'menu-close'
            ) {
              setInput(value);
            }
            console.log(action);
          }}
          onBlur={() =>
            setInput(() => {
              return address;
            })
          }
          isSearchable
          onChange={setSelectedOption}
          className="form__input--plugin"
          placeholder={t('homeinfo.searchlocation')}
          cacheOptions={true}
          closeMenuOnSelect
          loadOptions={loadSuggestions}
          openMenuOnFocus
          onFocus={handleFocus}
        />
        <LoadabledComponent loading={loadingUserAddress}>
          <Btn
            btnType={BtnType.circle}
            iconLink={<IoLocationOutline />}
            iconLeft={IconType.circle}
            contentAlignment={ContentAlignment.center}
            onClick={setCenterFromBrowser}
          />
        </LoadabledComponent>
      </div>
      {address && 
        <>{address}</>
      }
      {(markerPosition && markerPosition[0] && markerPosition[1] && !hideAddress) && (
        <>
           ( {roundCoords(markerPosition).toString()} )
        </>
      )}
    </div>
  );
}
