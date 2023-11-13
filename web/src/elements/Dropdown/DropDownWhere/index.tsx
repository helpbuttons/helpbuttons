import Loading from 'components/loading';
import Btn, {
  BtnType,
  ContentAlignment,
  IconType,
} from 'elements/Btn';
import t from 'i18n';
import { GlobalState, store } from 'pages';
import { useEffect, useState } from 'react';
import { IoLocationOutline } from 'react-icons/io5';
import { useDebounce } from 'shared/custom.hooks';
import { SetupDtoOut } from 'shared/entities/setup.entity';
import { roundCoords } from 'shared/honeycomb.utils';
import { GeoFindAddress, GeoReverseFindAddress } from 'state/Geo';
import { useRef } from 'store/Store';

export function DropDownWhere({
  handleSelectedPlace,
  placeholder,
  onFocus = (event) => {},
  onBlur = (event) => {},
  address = '',
  center = [0, 0],
}) {
  const [options, setOptions] = useState([]);

  const [input, setInput] = useState('');
  const debounceInput = useDebounce(input, 300);

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingNewAddress, setLoadingNewAddress] = useState(false);

  const setCenterFromBrowser = () => {
    setLoadingNewAddress(true);
    setShowSuggestions(false);
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

  useEffect(() => {
    if (debounceInput?.length > 2) {
      setLoadingNewAddress(true);
      setShowSuggestions(false);
      store.emit(
        new GeoFindAddress(debounceInput, (places) => {
          setOptions(
            places.map((place, key) => {
              return (
                <DropDownAutoCompleteOption
                  key={key}
                  label={place.formatted}
                  value={JSON.stringify(place)}
                />
              );
            }),
          );
          setLoadingNewAddress(false);
          setShowSuggestions(true);
        }),
      );
    }
  }, [debounceInput]);

  const onChangeInput = (e) => {
    let inputText = e.target.value;
    setInput(inputText);
  };

  const onClick = (e) => {
    const place = JSON.parse(e.target.value);
    setInput('');
    setShowSuggestions(false);
    setLoadingNewAddress(false);
    handleSelectedPlace(place);
  };

  const handleOnFocus = (event) => {
    onFocus(event);
    event.target.setAttribute('autocomplete', 'off');
  };

  const onInputClick = (e) => {
    e.target.select();
  };

  return (
    <>
      <div className="form__field">
        <label className="form__label">
          {t('buttonFilters.where')}
          {address && center && (
            <>
              ({address} - {roundCoords(center).toString()})
            </>
          )}
        </label>
        <div className='form__field--location'>
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
            onBlur={onBlur}
          ></input>
          {!loadingNewAddress && 
            <Btn
              btnType={BtnType.circle}
              iconLink={<IoLocationOutline />}
              iconLeft={IconType.circle}
              contentAlignment={ContentAlignment.center}
              onClick={setCenterFromBrowser}
            />
          }
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
    >{label}</option>
  );
}
