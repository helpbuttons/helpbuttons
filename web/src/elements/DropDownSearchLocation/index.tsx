import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { Subject } from 'rxjs';
import { SetupDtoOut } from 'shared/entities/setup.entity';
import { GlobalState, store } from 'pages';
import { useRef } from 'store/Store';
import { roundCoords } from 'shared/honeycomb.utils';
import { useDebounce } from 'shared/custom.hooks';
import { GeoFindAddress, GeoReverseFindAddress } from 'state/Geo';
import t from 'i18n';
import Btn, { BtnType, ContentAlignment, IconType } from 'elements/Btn';
import { IoLocationOutline } from 'react-icons/io5';
import Loading from 'components/loading';

export default function DropDownSearchLocation({
  handleSelectedPlace = (place) => {
    console.log(place);
  },
  placeholder,
  explain,
  address = '',
  center = [0, 0],
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
    <div className='form__field'>
      <label className="form__label">
        {t('buttonFilters.whereLabel')}
        {address && center && (
            <>
              ({address} - {roundCoords(center).toString()})
            </>
          )}
      </label>
      {explain && <div className='form__explain'>{explain}</div>}
      <div className='form__field--location'>
        <Select
          isSearchable
          onChange={setSelectedOption}
          options={options}
          onInputChange={(inputText) => requestAddresses(inputText)}
          className="form__input--plugin"
          placeholder={placeholder}
          noOptionsMessage={() => placeholder}
        />
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
    </div>
    
  );
}
