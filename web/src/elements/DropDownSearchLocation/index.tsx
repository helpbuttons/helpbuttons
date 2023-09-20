import React, {  useEffect,useState } from 'react';
import Select from 'react-select';
import { setValueAndDebounce } from 'state/HomeInfo';
import { Subject } from 'rxjs';
import { SetupDtoOut } from 'shared/entities/setup.entity';
import { GlobalState, store } from 'pages';
import { useRef } from 'store/Store';


export default function DropDownSearchLocation({handleSelectedPlace = (place) => {console.log(place)}, placeholder}) {
  const [options, setOptions] = useState([]);

  const timeInMsBetweenStrokes = 80; //ms
  const config: SetupDtoOut = useRef(
    store,
    (state: GlobalState) => state.config,
  );

  const [sub, setSub] = useState(new Subject()); //evita la inicializaacion en cada renderizado
  const [sub$, setSub$] = useState(
    setValueAndDebounce(sub, timeInMsBetweenStrokes),
  ); //para no sobrecargar el componente ,lo delegamos a una lib externa(solid);

  const setSelectedOption = (selectedOption) => {
    const selectedPlace = JSON.parse(selectedOption.value)
    handleSelectedPlace(selectedPlace)
  }
  
  useEffect(() => {
    let s = sub$.subscribe(
      (results: any) => {
        if (results) {
          setOptions(
            results.map((place) => {
              return ({
                  label: place.formatted,
                  value: JSON.stringify(place),
                  id: place.id
              }
              );
            }),
          );
        } else {
          console.error(
            'Error with geocoding api',
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

  const requestAddresses = (inputText) => 
  {
    if (inputText.length > 2)
    {
      sub.next(inputText);
    }
  }
  return (
    <>
      <Select
        isSearchable
        onChange={setSelectedOption}
        options={options}
        onInputChange={(inputText) => requestAddresses(inputText)}
        className='form__input--plugin'
        placeholder={placeholder}
        noOptionsMessage= { () => placeholder}
      />
      </>
  );
}