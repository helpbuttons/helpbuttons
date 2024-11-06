import Loading, { LoadabledComponent } from 'components/loading';
import Btn, {
  BtnType,
  ContentAlignment,
  IconType,
} from 'elements/Btn';
import t from 'i18n';
import { GlobalState, store } from 'pages';
import { useCallback, useEffect, useState } from 'react';
import { IoLocationOutline } from 'react-icons/io5';
import { useDebounce } from 'shared/custom.hooks';
import { SetupDtoOut } from 'shared/entities/setup.entity';
import { roundCoords } from 'shared/honeycomb.utils';
import { GeoFindAddress, GeoReverseFindAddress } from 'state/Geo';
import { useRef } from 'store/Store';
import debounce from 'lodash.debounce';

export function DropDownWhere({
  handleSelectedPlace,
  placeholder,
  markerAddress = '',
  markerPosition = [0, 0],
  toggleLoadingNewAddress,
  loadingNewAddress,
  hideAddress,
  requestPlacesForQuery,
}) {
  const [options, setOptions] = useState([]);

  const [input, setInput] = useState('');
  const debounceInput = useDebounce(input, 300);

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);

  const setCenterFromBrowser = () => {
    toggleLoadingNewAddress(true);
    setShowSuggestions(false);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        store.emit(
          new GeoReverseFindAddress(
            position.coords.latitude,
            position.coords.longitude,
            (place) => {
              handleSelectedPlace(place);
              toggleLoadingNewAddress(false);
            },
            (err) => console.log(err),
          ),
        );
      });
    }
  };

  const handleKeyDown = () => {
    if (input.length < 1) {
      setShowSuggestions(() => false);

      return;
    }
      requestPlacesForQuery(input, (places) => {
        setOptions(
          places.map((place, key) => {
            const label = hideAddress
              ? place.formatted_city
              : place.formatted;
            return (
              <DropDownAutoCompleteOption
                key={key}
                label={label}
                value={JSON.stringify(place)}
              />
            );
          }),
        );
      });
      toggleLoadingNewAddress(false);
      setShowSuggestions(true);
  };
  const onChangeInput = (e) => {
    let inputText = e.target.value;
    setInput(() => inputText);
  };

  const onClick = (e) => {
    if (e?.target?.value) {
      const place = JSON.parse(e.target.value);
      handleSelectedPlace(place);
    }
    setShowSuggestions(false);
    toggleLoadingNewAddress(false);
  };

  const handleOnFocus = (event) => {
    setShowSuggestions(true);
    setHasFocus(true);
    event.target.setAttribute('autocomplete', 'off');
  };
  const handleMouseLeave = (event) => {
    setHasFocus(false);
    setTimeout(() => !hasFocus ? setShowSuggestions(false) : '', 100);
  };
  const onInputClick = (e) => {
    e.target.select();
  };

  useEffect(() => {
    setInput(() => markerAddress);
  }, [markerAddress]);
  return (
    <>
      <div onMouseLeave={handleMouseLeave} className="form__field">
        <label className="form__label">
          {t('buttonFilters.where')}
        </label>
        <div className="form__field--location">
          <LoadabledComponent loading={loadingNewAddress}>
            <input
              className="form__input"
              autoComplete="on"
              onChange={onChangeInput}
              list=""
              id="input"
              name="browsers"
              placeholder={placeholder}
              type="text"
              value={input}
              onClick={onInputClick}
              onFocus={handleOnFocus}
              onKeyDown={handleKeyDown}
            ></input>
          </LoadabledComponent>
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
        {showSuggestions && (
          <datalist
            onClick={onClick}
            className="dropdown-nets__dropdown-content"
            id="listid"
          >
            {options}
          </datalist>
        )}
        {markerAddress && markerPosition[0] && markerPosition[1] && (
          <>({roundCoords(markerPosition).toString()})</>
        )}
      </div>
    </>
  );
}

export function DropDownAutoCompleteOption({ value, label }) {
  return (
    <option
      className="dropdown-nets__dropdown-option"
      label={label}
      value={value}
    >
      {label}
    </option>
  );
}
