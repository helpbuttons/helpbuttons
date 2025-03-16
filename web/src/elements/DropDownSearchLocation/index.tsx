import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { SetupDtoOut } from 'shared/entities/setup.entity';
import { GlobalState, store } from 'state';
import { useStore } from 'state';
import { roundCoords } from 'shared/honeycomb.utils';
import { useToggle } from 'shared/custom.hooks';
import {
  GeoFindAddress,
  GeoReverseFindAddress,
  emptyPlace,
} from 'state/Geo';
import t from 'i18n';
import Btn, {
  BtnType,
  ContentAlignment,
  IconType,
} from 'elements/Btn';
import { IoCloseOutline, IoCopyOutline, IoCreateOutline, IoLocationOutline } from 'react-icons/io5';
import { LoadabledComponent } from 'components/loading';
import AsyncSelect from 'react-select/async';
import debounce from 'lodash.debounce';
import _ from 'lodash';
import { useGeoSearch } from 'elements/Fields/FieldLocation/location.helpers';
import FieldText from 'elements/Fields/FieldText';
import { useForm } from 'react-hook-form';
import { alertService } from 'services/Alert';

export default function DropDownSearchLocation({
  handleSelectedPlace = (place) => { },
  placeholder,
  label = '',
  explain = '',
  markerAddress = '',
  loadingNewAddress = false,
  hideAddress = false,
  toggleLoadingNewAddress,
  markerPosition,
}) {
  const config: SetupDtoOut = useStore(
    store,
    (state: GlobalState) => state.config,
  );

  const geoSearch = useGeoSearch()

  const setSelectedOption = (selectedOption) => {
    if (!selectedOption) {
      setInput(() => '');
      return
    }
    const selectedPlace = JSON.parse(selectedOption.value);
    handleSelectedPlace(selectedPlace);
  };
  interface SelectOption {
    readonly value: string;
    readonly label: string;
    readonly isFixed?: boolean;
    readonly isDisabled?: boolean;
  }
  const bounce = useRef(false);
  const options = useRef([]);
  const loadSuggestions = function (input, callback) {
    toggleLoadingNewAddress(() => true);
    geoSearch(input, hideAddress, (places) => {
      toggleLoadingNewAddress(() => false);
      if (places.length > 0) {
          options.current = places.map((place, key) => {
            return {
              label: place.formatted,
              value: JSON.stringify(place),
              id: key,
            };
          });

        bounce.current = false;
        toggleLoadingNewAddress(() => false);
        return callback(options.current);
      }
      return callback([]);
    }, (error) => {
      alertService.error(t('button.errorAddressFetch'))
      return callback([]);
    });
  };
  const [input, setInput] = useState('');

  useEffect(() => {
    if (markerAddress) {
      setInput(() => markerAddress);
    }
  }, [markerAddress]);
  const handleFocus = (event) => {
    event.target.select();
  }

  const [showCustomAddressForm, setShowCustomAddressForm] = useState(false)
  return (
    <div className="form__field">
      {explain && <div className="form__explain">{explain}</div>}
      <div className="form__field--location">
        {!showCustomAddressForm ?
          <>
            <AsyncSelect
              inputValue={input}
              onInputChange={(value, action) => {
                if (
                  action?.action !== 'input-blur' &&
                  action?.action !== 'menu-close'
                ) {
                  setInput(value);
                }
              }}
              onBlur={() =>
                setInput(() => {
                  return markerAddress;
                })
              }
              isSearchable
              onChange={setSelectedOption}
              className="form__input--plugin"
              placeholder={t('homeinfo.searchlocation')}
              cacheOptions={true}
              closeMenuOnSelect
              loadOptions={loadSuggestions}
              openMenuOnFocus
              onFocus={handleFocus}
            />
            <Btn
              btnType={BtnType.submit}
              caption={t('button.customLocation')}
              iconLeft={IconType.circle}
              contentAlignment={ContentAlignment.center}
              onClick={() => { setShowCustomAddressForm(() => true) }}
            />
            <LoadUserLocationButton handleSelectedPlace={handleSelectedPlace} />
          </>
          :
          <><CustomAddress showCustomAddressForm={showCustomAddressForm} markerAddress={markerAddress} />
            <Btn
              btnType={BtnType.circle}
              iconLink={<IoCloseOutline />}
              iconLeft={IconType.circle}
              contentAlignment={ContentAlignment.center}
              onClick={() => { setShowCustomAddressForm(() => false) }}

            />
          </>
        }


      </div>
      {/* {address && 
        <>{address}</>
      } */}
      {(markerPosition && markerPosition[0] && markerPosition[1] && !hideAddress) && (
        <div className='form__input-subtitle-option form__input-subtitle--grayed'>
          ( {roundCoords(markerPosition).toString()} )
        </div>
      )}

    </div>
  );
}

export function LoadUserLocationButton({ handleSelectedPlace }) {
  const [loadingUserAddress, toggleLoadingUserAddress] =
    useState(false);

  const setCenterFromBrowser = () => {
    toggleLoadingUserAddress(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        store.emit(
          new GeoReverseFindAddress(
            position.coords.latitude,
            position.coords.longitude,
            (place) => {
              handleSelectedPlace(place);
              toggleLoadingUserAddress(false);
            },
            (error) => {
              toggleLoadingUserAddress(() => false);
              handleSelectedPlace(
                emptyPlace({
                  lat: position.coords.latitude.toString(),
                  lng: position.coords.longitude.toString(),
                }),
              );
              console.log(error);
            },
          ),
        );
      });
    }
  };
  return (<Btn
    btnType={BtnType.circle}
    iconLink={
      <LoadabledComponent loading={loadingUserAddress}>
        <IoLocationOutline />
      </LoadabledComponent>
    }
    iconLeft={IconType.circle}
    contentAlignment={ContentAlignment.center}
    onClick={setCenterFromBrowser}
  />)
}

export function AddressField({ register, addressField }) {

  // on writing, search... on loaded addresses...make request
  // onmapclick... load from map button shows!
  // on edit address button, address will be edited.. Load from map!
  const onTypingAddress = (e) => {
    // search on loaded addresses, load more addresses if string was not requested yet!
    console.log(e.target.value)
  }

  const [suggestions, setSuggestions] = useState([]);

  const handleFocus = (event) => event.target.select();

  return (
    <>
      <FieldText
        name="address"
        label={t('button.address')}
        placeholder={t('button.placeHolderAddress')}
        onChange={onTypingAddress}
        onFocus={handleFocus}
        {...register(addressField, { required: true })}
      />
      <Btn
        btnType={BtnType.circle}
        iconLink={<IoCopyOutline />}
        iconLeft={IconType.circle}
        contentAlignment={ContentAlignment.center}
        onClick={() => { console.log('copy address to address field!') }}
      />
    </>)
}


export function CustomAddress({ showCustomAddressForm, markerAddress }) {
  const {
    register,
    setValue
  } = useForm();

  useEffect(() => {
    setValue('customAddress', markerAddress)
  }, [showCustomAddressForm])

  const handleFocus = (event) => event.target.select();

  return (
    <>
      <FieldText
        name="address"
        label={t('button.address')}
        placeholder={t('button.placeHolderAddress')}
        onFocus={handleFocus}
        {...register('customAddress', { required: true })}
      />
    </>
  )

}