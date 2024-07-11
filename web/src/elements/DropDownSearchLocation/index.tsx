import React, { useRef, useState } from 'react';
import Select from 'react-select';
import { Subject } from 'rxjs';
import { SetupDtoOut } from 'shared/entities/setup.entity';
import { GlobalState, store } from 'pages';
import { useStore } from 'store/Store';
import { roundCoords } from 'shared/honeycomb.utils';
import { useDebounce } from 'shared/custom.hooks';
import { GeoFindAddress, GeoReverseFindAddress } from 'state/Geo';
import t from 'i18n';
import Btn, {
  BtnType,
  ContentAlignment,
  IconType,
} from 'elements/Btn';
import { IoLocationOutline } from 'react-icons/io5';
import Loading from 'components/loading';
import AsyncSelect from 'react-select/async';
import debounce from 'lodash.debounce';

export default function DropDownSearchLocation({
  handleSelectedPlace = (place) => {
  },
  placeholder,
  label = '',
  explain = '',
  address = '',
  center = [0, 0],
}) {
  const config: SetupDtoOut = useStore(
    store,
    (state: GlobalState) => state.config,
  );

  const setSelectedOption = (selectedOption) => {
    const selectedPlace = JSON.parse(selectedOption.value);
    handleSelectedPlace(selectedPlace);
  };

  const [loadingNewAddress, setLoadingNewAddress] = useState(false);

  const setCenterFromBrowser = () => {
    setLoadingNewAddress(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        store.emit(
          new GeoReverseFindAddress(
            position.coords.latitude,
            position.coords.longitude,
            (place) => {
              handleSelectedPlace(place);
              setLoadingNewAddress(false);
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
  
  const _loadSuggestions = (inputValue, callback) => {
    fetch('/api/geo/search/' + inputValue).then((response) => {
      return response.text().then((res) => {
        {
          const places = JSON.parse(res);
          if (places.length > 0) {
            options.current = places.map((place, key) => {
              return {
                label: place.formatted,
                value: JSON.stringify(place),
                id: key,
              };
            });
            bounce.current = false;
            return callback(options.current);
          }
        }
      });
    });
  };
  const loadSuggestions = debounce(_loadSuggestions, 300);

  return (
    <div className="form__field">
      <label className="form__label">
        {label}
        {address && center && (
          <>{label ? ` ( ${address} [${roundCoords(center).toString()}] )` : address}</>
        )}
      </label>
      {explain && <div className="form__explain">{explain}</div>}
      <div className="form__field--location">
        <AsyncSelect
          isSearchable
          onChange={setSelectedOption}
          className="form__input--plugin"
          placeholder={placeholder}
          noOptionsMessage={() => placeholder}
          cacheOptions={false}
          loadOptions={loadSuggestions}
          value={address}
        />
        {!loadingNewAddress && (
          <Btn
            btnType={BtnType.circle}
            iconLink={<IoLocationOutline />}
            iconLeft={IconType.circle}
            contentAlignment={ContentAlignment.center}
            onClick={setCenterFromBrowser}
          />
        )}

        {loadingNewAddress && <Loading />}
      </div>
    </div>
  );
}
