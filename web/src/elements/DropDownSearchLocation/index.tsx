import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { Subject } from 'rxjs';
import { SetupDtoOut } from 'shared/entities/setup.entity';
import { GlobalState, store } from 'pages';
import { useRef } from 'store/Store';
import { useDebounce } from 'shared/custom.hooks';
import { GeoFindAddress } from 'state/Geo';

export default function DropDownSearchLocation({
  handleSelectedPlace = (place) => {
    console.log(place);
  },
  placeholder,
}) {
  const [options, setOptions] = useState([]);

  const timeInMsBetweenStrokes = 80; //ms
  const config: SetupDtoOut = useRef(
    store,
    (state: GlobalState) => state.config,
  );

  const [input, setInput] = useState('');
  const debounceInput = useDebounce(input, 300);

  const setSelectedOption = (selectedOption) => {
    const selectedPlace = JSON.parse(selectedOption.value);
    handleSelectedPlace(selectedPlace);
  };


  const requestAddresses = (inputText) => {
    setInput(() => inputText);
  };


  useEffect(() => {
    if (debounceInput?.length > 2) {
      store.emit(
        new GeoFindAddress(debounceInput, (places) => {
          setOptions(
            places.map((place, key) => {
              return {
                label: place.formatted,
                value: JSON.stringify(place),
                id: key,
              };
            }),
          );
        }),
      );
    }
  }, [debounceInput]);

  return (
    <>
      <Select
        isSearchable
        onChange={setSelectedOption}
        options={options}
        onInputChange={(inputText) => requestAddresses(inputText)}
        className="form__input--plugin"
        placeholder={placeholder}
        noOptionsMessage={() => placeholder}
      />
    </>
  );
}
