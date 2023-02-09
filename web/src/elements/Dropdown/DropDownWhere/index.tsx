//INFO AND RESULTS
//libraries
import { useState, useEffect } from 'react';
import { Subject } from 'rxjs';
// import {
//   setValueAndDebounce,
// } from "./data";

import { setValueAndDebounce } from 'state/HomeInfo';
import router from 'next/router';
import t from 'i18n';
import { DropdownAutoComplete, DropDownAutoCompleteOption } from '../DropDownAutoComplete';
import { SetupDtoOut } from 'services/Setup/config.type';
import { useRef } from 'store/Store';
import { GlobalState, store } from 'pages';

export function DropDownWhere({placeholder}) {
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
  
    const onChange = (inputText) => {
      sub.next(JSON.stringify({apikey: config.mapifyApiKey,address: inputText}));
    };
  
    useEffect(() => {
      let s = sub$.subscribe(
        (rs: any) => {
          if (rs && rs.results) {
            setOptions(
              rs.results.map((place) => {
                return (
                  <DropDownAutoCompleteOption
                    key={place.place_id}
                    label={place.formatted}
                    value={JSON.stringify(place)}
                  />
                );
              }),
            );
          }else{
            console.error('rs undefined??! 176 homeinfo')
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
  
    const setValue = (place) => {
      place = JSON.parse(place);
      router.push({
        pathname: '/Explore',
        query: place.geometry,
      });
    };
    return (
      <>
        <DropdownAutoComplete
          setValue={setValue}
          onChange={onChange}
          options={options}
          placeholder={placeholder}
        ></DropdownAutoComplete>
      </>
    );
  }
  