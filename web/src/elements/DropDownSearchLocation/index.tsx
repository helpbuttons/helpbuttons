import React, { useRef } from 'react';
import { SetupDtoOut } from 'shared/entities/setup.entity';
import { GlobalState, store } from 'pages';
import { useStore } from 'store/Store';
import { roundCoords } from 'shared/honeycomb.utils';
import { useToggle } from 'shared/custom.hooks';
import { GeoFindAddress, GeoReverseFindAddress } from 'state/Geo';
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

export default function DropDownSearchLocation({
  handleSelectedPlace = (place) => {},
  placeholder,
  label = '',
  explain = '',
  address = '',
  center = [0, 0],
  loadingNewAddress = false
}) {
  const config: SetupDtoOut = useStore(
    store,
    (state: GlobalState) => state.config,
  );

  const setSelectedOption = (selectedOption) => {
    const selectedPlace = JSON.parse(selectedOption.value);
    handleSelectedPlace(selectedPlace);
  };

  const [loadingBrowserAddress, toggleLoadingBrowserAddress] = useToggle(false);

  const setCenterFromBrowser = () => {
    toggleLoadingBrowserAddress(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        store.emit(
          new GeoReverseFindAddress(
            position.coords.latitude,
            position.coords.longitude,
            (place) => {
              handleSelectedPlace(place);
              toggleLoadingBrowserAddress(false);
            }
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
    store.emit(
      new GeoFindAddress(inputValue, (places) => {
        console.log(places)
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
      }),
    );
  };
  const loadSuggestions = debounce(_loadSuggestions, 750);

  return (
    <div className="form__field">
      <LoadabledComponent loading={loadingNewAddress}>
        <label className="form__label">
          {label}
          {address && center && (
            <>
              {label
                ? ` ( ${address} [${roundCoords(center).toString()}] )`
                : address}
            </>
          )}
        </label>
      </LoadabledComponent>
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
        <LoadabledComponent loading={loadingBrowserAddress}>
          <Btn
            btnType={BtnType.circle}
            iconLink={<IoLocationOutline />}
            iconLeft={IconType.circle}
            contentAlignment={ContentAlignment.center}
            onClick={setCenterFromBrowser}
          />
        </LoadabledComponent>
      </div>
    </div>
  );
}
