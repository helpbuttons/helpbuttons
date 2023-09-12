import Loading from 'components/loading';
import t from 'i18n';
import { GlobalState, store } from 'pages';
import { useEffect, useState } from 'react';
import { Subject } from 'rxjs';
import { alertService } from 'services/Alert';
import { SetupDtoOut } from 'shared/entities/setup.entity';
import { roundCoords } from 'shared/honeycomb.utils';
import { setValueAndDebounce } from 'state/HomeInfo';
import { useRef } from 'store/Store';

export function DropDownWhere({
  handleSelectedPlace,
  placeholder,
  onFocus = (event) => {},
  onBlur = (event) => {},
  address = '',
  center = [0, 0],
}) {
  const timeInMsBetweenStrokes = 150; //ms

  const config: SetupDtoOut = useRef(
    store,
    (state: GlobalState) => state.config,
  );

  const [options, setOptions] = useState([]);

  const [sub, setSub] = useState(new Subject()); //evita la inicializaacion en cada renderizado
  const [sub$, setSub$] = useState(
    setValueAndDebounce(sub, timeInMsBetweenStrokes),
  ); //para no sobrecargar el componente ,lo delegamos a una lib externa(solid);

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [input, setInput] = useState(address);

  const onChangeInput = (e) => {
    let inputText = e.target.value;
    setInput(inputText);
    setShowSuggestions(false);
    if (inputText.length > 2) {
      setLoadingNewAddress(true);
      sub.next(inputText);
    }
  };

  const onClick = (e) => {
    const place = JSON.parse(e.target.value);
    setInput(place.formatted);
    setShowSuggestions(false);
    handleSelectedPlace(place);
  };

  const handleOnFocus = (event) => {
    onFocus(event);
    event.target.setAttribute('autocomplete', 'off');
  };

  const onInputClick = (e) => {
    e.target.select();
  };

  const [loadingNewAddress, setLoadingNewAddress] = useState(false);

  useEffect(() => {
    let keyCount = 1;
    let s = sub$.subscribe(
      (rs: any) => {
        if (rs) {
          setLoadingNewAddress(false);
          setOptions(
            rs.map((place) => {
              return (
                <DropDownAutoCompleteOption
                  key={keyCount++}
                  label={place.formatted}
                  value={JSON.stringify(place)}
                />
              );
            }),
          );
          setShowSuggestions(true);
        } else {
          console.error(
            'API opencage not working, do you have an adblocker? Or contact the administrator',
          );
        }
      },
      (e) => {
        console.log('error subscribe', e);
      },
    );
    return () => {
      s.unsubscribe(); //limpiamos
    };
  }, [sub$]); //first time
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
        {loadingNewAddress && <Loading />}

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
    ></option>
  );
}
