import Loading, { LoadabledComponent } from "components/loading";
import Btn, { BtnType, ContentAlignment, IconType } from "elements/Btn";
import { useGeoSearch } from "elements/Fields/FieldLocation/location.helpers";
import t from "i18n";
import { useEffect, useRef, useState } from "react";
import { IoCloseOutline, IoLocationOutline } from "react-icons/io5";
import { alertService } from "services/Alert";
import dconsole from "shared/debugger";
import { roundCoord, roundCoords } from "shared/honeycomb.utils";
import { store } from "state";
import { emptyPlace, GeoReverseFindAddress } from "state/Geo";
import { useSelectedNetwork } from "state/Networks";

export function LocationSearchBarSimple({
    placeholder,
    label = null,
    explain = null,
    markerAddress,
    setMarkerAddress,
    markerPosition,
    setMarkerPosition
}){
    const [searchAddress, setSearchAddress] = useState(markerAddress)
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false)

    const handleAddressPicked = (place) => {
        setSearchAddress(() => place.formatted)
        setMarkerAddress(place.formatted)
        setMarkerPosition([place.geometry.lat, place.geometry.lng])
        setResults(() => [])
    }

    return <>
    <div className="form__field form__field--location-wrapper">
            {label && <div className="form__label">{label}</div>}
            {explain && <div className="form__explain">{explain}</div>}
            <div className="form__field-dropdown form__field-dropdown--location">
                <div className="form__field-dropdown--input-location">
                    <FieldLocationSearch pickedAddress={searchAddress} placeholder={placeholder} setResults={setResults} isLoading={isLoading} setIsLoading={setIsLoading} focusPoint={markerPosition} /> 
                    <LoadUserLocationButton handleBrowserLocation={handleAddressPicked}/>
                </div>
                {(results && results.length > 0) &&
                    <SearchResultsList handleAddressPicked={handleAddressPicked} results={results} />
                }
                {(markerPosition && markerPosition[0] && markerPosition[1] ) && (
                    <div className='form__input-subtitle-option form__input-subtitle--grayed'>
                        ( {roundCoords(markerPosition).toString()} )
                    </div>
                )}
            </div>
        </div>
    </>
}
export default function LocationSearchBar({
    placeholder,
    label = null,
    explain = null,
    hideAddress,
    isCustomAddress,
    setIsCustomAddress,
    pickedPosition,
    setPickedPosition,
    isLoading,
    setIsLoading,
    pickedAddress,
    setPickedAddress
}) {
    const [results, setResults] = useState([]);
    const [showAddCustomButton, toggleShowAddCustomButton] = useState(false)

    const handleAddressPicked = (place) => {
        setPickedAddress(() => place.formatted)
        setPickedPosition(() => [place.geometry.lat, place.geometry.lng])
        setResults(() => [])
        toggleShowAddCustomButton(() => false)
    }

    useEffect(() => {
        if (!showAddCustomButton) {
            setResults(() => null)
        }
    }, [showAddCustomButton])

    const handleFocus = (event) => {
        toggleShowAddCustomButton(() => true)
    }

    return <>
        <div className="form__field form__field--location-wrapper">
            {label && <div className="form__label">{label}</div>}
            {explain && <div className="form__explain">{explain}</div>}
            <div className="form__field-dropdown form__field-dropdown--location">
                <div className="form__field-dropdown--input-location">
                    <FieldLocationSearch isCustomAddress={isCustomAddress} pickedAddress={pickedAddress} placeholder={placeholder} setResults={setResults} onFocus={handleFocus} hideAddress={hideAddress} isLoading={isLoading} setIsLoading={setIsLoading} focusPoint={pickedPosition} />
                    <FieldCustomAddress isCustomAddress={isCustomAddress} pickedAddress={pickedAddress} setPickedAddress={setPickedAddress} setIsCustomAddress={setIsCustomAddress} />
                    <LoadUserLocationButton handleBrowserLocation={handleAddressPicked} hideAddress={hideAddress} />
                </div>
                {(results && results.length > 0) &&
                    <SearchResultsList handleAddressPicked={handleAddressPicked} results={results} hideAddress={hideAddress} />
                }
                {(showAddCustomButton && isCustomAddress !== null) &&
                    <SearchCustomAddress handleClick={() => { setIsCustomAddress(true); toggleShowAddCustomButton(() => false) }} />
                }

                {(pickedPosition && pickedPosition[0] && pickedPosition[1]) && (
                    <div className='form__input-subtitle-option form__input-subtitle--grayed'>
                        ( {roundCoords(pickedPosition).toString()} )
                    </div>
                )}
            </div>
        </div>
    </>
}

function FieldLocationSearch({ isCustomAddress = false, placeholder, setResults, hideAddress = false, onFocus = (event) => {}, pickedAddress, isLoading, setIsLoading, focusPoint }) {
    const geoSearch = useGeoSearch()
    const [searching, setIsSearching] = useState(false)
    const [input, setInput] = useState(pickedAddress ? pickedAddress : '');
    const searchQuery = useRef(pickedAddress)

    useEffect(() => {
        setIsLoading(() => searching)
    }, [searching])
    useEffect(() => {
        if(pickedAddress)
        {
            setInput(() => pickedAddress)
        }
    }, [pickedAddress])

    const searchAddress = () => {
        setIsSearching(() => true)
        dconsole.log('searching... ', focusPoint, searchQuery.current)
        geoSearch(searchQuery.current, roundCoord(focusPoint[0]), roundCoord(focusPoint[1]), false, (places) => {
            if (places.length > 0) {
                const placesFound = places.map((place, key) => {
                    return {
                        ...place,
                        id: key,
                    };
                })
                setResults(() => placesFound);
            } else {
                setResults(() => [])
            }
            setIsSearching(() => false)
        }, (error) => {
            alertService.error(t('button.errorAddressFetch'))
            setResults(() => [])
            setIsSearching(() => false)
            return;
        });
    };
    const handleChange = (value) => {
        if (isCustomAddress) {
            return;
        }
        setInput((prevValue) => {
            if (prevValue != value) {

                if (value.length > 0) {
                    searchQuery.current = value;
                    searchAddress()
                }else{
                    setResults(() => [])
                }
            }
            return value;
        });
    };

    const handleFocus = (event) => {
        event.target.select();
        onFocus(event)
    }
    return <>{!isCustomAddress &&
        <>
            <input
                className="form__input--dropdown-search__input"
                placeholder={placeholder}
                value={input}
                onChange={(e) => handleChange(e.target.value)}
                onFocus={handleFocus}
            />
            {isLoading && <div className="form__input--location-loading"><Loading /></div>}
        </>
    }</>

}
function FieldCustomAddress({ isCustomAddress, setIsCustomAddress, pickedAddress, setPickedAddress }) {

    const [input, setInput] = useState(pickedAddress);

    const handleFocus = (e) => {
        e.target.select()
    }
    const handleChange = (e) => {
        const value = e.target.value
        setPickedAddress(() => value)
        setInput(value)
    }

    return (<>{isCustomAddress &&
        <div className="form__input--dropdown-search">
            <input
                className="form__input--dropdown-search__input"
                placeholder={t('button.placeHodlerCustomAddress')}
                value={input}
                onFocus={handleFocus}
                onChange={handleChange}
            />
            <div className="form__input--location-loading">
                <Btn
                    btnType={BtnType.smallCircle}
                    iconLink={<IoCloseOutline />}
                    iconLeft={IconType.circle}
                    contentAlignment={ContentAlignment.center}
                    onClick={() => { setIsCustomAddress(false) }}
                />
            </div>
        </div>
    }
    </>)
}
export function SearchCustomAddress({ handleClick }) {
    const selectedNetworkName = useSelectedNetwork().name
    return (<>
        <hr />
        <div
            className="dropdown__dropdown-option"
            onClick={handleClick}
        >
            {t('button.proposeAddress', [selectedNetworkName])}
        </div>
    </>)
}
export function SearchResultsList({ results, hideAddress = false, handleAddressPicked }) {
    return (
        <div className="dropdown__dropdown-content">
            {results.map((result, id) => {
                return <SearchResult handleAddressPicked={handleAddressPicked} result={result} key={id} />;
            })}
        </div>
    );
};


export function SearchResult({ result, handleAddressPicked }) {
    return (
        <div
            className="dropdown__dropdown-option"
            onClick={(e) => { handleAddressPicked(result) }}
        >
            {result.formatted}
        </div>
    );
};


export function LoadUserLocationButton({ handleBrowserLocation, hideAddress = false}) {
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
              hideAddress,
              (place) => {
                handleBrowserLocation(place);
                toggleLoadingUserAddress(false);
              },
              (error) => {
                toggleLoadingUserAddress(() => false);
                handleBrowserLocation(
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