import { GlobalState, store } from 'pages';
import { useEffect, useState } from 'react';
import { Subject } from 'rxjs';
import { alertService } from 'services/Alert';
import { SetupDtoOut } from 'shared/entities/setup.entity';
import { setValueAndDebounce } from 'state/HomeInfo';
import { useRef } from 'store/Store';

export function DropDownWhere({
  handleSelectedPlace,
  placeholder,
  onFocus = (event) => {},
  onBlur = (event) => {},
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
  const [input, setInput] = useState('');

  const onChangeInput = (e) => {
    let inputText = e.target.value;
    setInput(inputText)
    setShowSuggestions(false)
    if (inputText.length > 2)
    {
      sub.next(inputText)
    }
  };

  const onClick = (e) => {
    const place = JSON.parse(e.target.value);
    handleSelectedPlace(place);
  };

  const handleOnFocus = (event) => {
    onFocus(event);
    event.target.setAttribute('autocomplete', 'off');
  };

  const onInputClick = (e) => {
    e.target.select();
  };

  useEffect(() => {
    let keyCount = 1;
    let s = sub$.subscribe(
      (rs: any) => {
        if (rs && rs.results) {
          setOptions(
            rs.results.map((place) => {
              return (
                <DropDownAutoCompleteOption
                  key={keyCount++}
                  label={place.formatted}
                  value={JSON.stringify(place)}
                />
              );
            }),
          );
          setShowSuggestions(true)
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

      {showSuggestions && (
        <datalist
          onClick={onClick}
          className="dropdown-nets__dropdown-content"
          id="listid"
        >
          {options}
        </datalist>
      )}
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
