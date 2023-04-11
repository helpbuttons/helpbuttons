import React, {  useEffect,useState } from 'react';
import Select from 'react-select';
import { setValueAndDebounce } from 'state/HomeInfo';
import { Subject } from 'rxjs';
import { SetupDtoOut } from 'shared/entities/setup.entity';
import { GlobalState, store } from 'pages';
import { useRef } from 'store/Store';


export default function DropDownSearchLocation({handleSelectedPlace, placeholder}) {
//   const [selectedOption, setSelectedOption] = useState(null);
  const [options, setOptions] = useState([]);
  
  const timeInMsBetweenStrokes = 150; //ms
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
      (rs: any) => {
        if (rs && rs.results) {
          setOptions(
            rs.results.map((place) => {
              return ({
                  label: place.formatted,
                  value: JSON.stringify(place)}
              );
            }),
          );
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
    <div className="App">
      <Select
        isSearchable
        onChange={setSelectedOption}
        options={options}
        onInputChange={(inputText) => {
            if (inputText.length > 2)
            {
            sub.next(
                JSON.stringify({
                apikey: config.mapifyApiKey,
                address: inputText,
                }),
            );
            }
        }}
        placeholder={placeholder}
        noOptionsMessage= { () => 'Type to search location' }
      />
    
    </div>
    </>
  );
}