import Loading from "components/loading";
import Btn, { BtnType, ContentAlignment, IconType } from "elements/Btn";
import { LoadUserLocationButton } from "elements/DropDownSearchLocation";
import { useGeoSearch } from "elements/Fields/FieldLocation/location.helpers";
import t from "i18n";
import { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { alertService } from "services/Alert";
import { roundCoords } from "shared/honeycomb.utils";
import { useSelectedNetwork } from "state/Networks";

export default function LocationSearchBar({
    placeholder,
    label = null,
    explain = null,
    markerAddress,
    hideAddress,
    isCustomAddress,
    setIsCustomAddress,
    setMarkerAddress,
    markerPosition,
    setMarkerPosition,
    isLoading,
    setIsLoading,
    mapAddress
}) {
    const [results, setResults] = useState([]);
    const [showAddCustomButton, toggleShowAddCustomButton] = useState(false)
    const [searchAddress, setSearchAddress] = useState(markerAddress)

    const handleAddressPicked = (place) => {
        setSearchAddress(() => place.formatted)
        setMarkerAddress(place.formatted)
        setMarkerPosition([place.geometry.lat, place.geometry.lng])
        setResults(() => [])
        toggleShowAddCustomButton(() => false)
    }

    useEffect(() => {
        if (!showAddCustomButton) {
            setMarkerPosition(markerPosition)
            setResults(() => null)
        }
    }, [showAddCustomButton])

    const handleFocus = (event) => {
        toggleShowAddCustomButton(() => true)
    }

    useEffect(() => {
        if (!isCustomAddress) {
            setSearchAddress(() => mapAddress.address)
        }
    }, [mapAddress, isCustomAddress])

    useEffect(() => {
        if (isCustomAddress) {
            setMarkerAddress(searchAddress)
        }
    }, [searchAddress, isCustomAddress])


    return <>
        <div className="form__field form__field--location-wrapper">
            {label && <div className="form__label">{label}</div>}
            {explain && <div className="form__explain">{explain}</div>}
            <div className="form__field-dropdown form__field-dropdown--location">
                <div className="form__field-dropdown--input-location">
                    <FieldLocationSearch isCustomAddress={isCustomAddress} pickedAddress={searchAddress} placeholder={placeholder} setResults={setResults} onFocus={handleFocus} hideAddress={hideAddress} isLoading={isLoading} setIsLoading={setIsLoading} />
                    <FieldCustomAddress isCustomAddress={isCustomAddress} pickedAddress={searchAddress} setPickedAddress={setSearchAddress} setIsCustomAddress={setIsCustomAddress} />
                    <LoadUserLocationButton handleBrowserLocation={handleAddressPicked} hideAddress={hideAddress} />
                </div>
                {(results && results.length > 0) &&
                    <SearchResultsList handleAddressPicked={handleAddressPicked} results={results} hideAddress={hideAddress} />
                }
                {showAddCustomButton &&
                    <SearchCustomAddress handleClick={() => { setIsCustomAddress(() => true); toggleShowAddCustomButton(() => false) }} />
                }

                {(markerPosition && markerPosition[0] && markerPosition[1] && !hideAddress) && (
                    <div className='form__input-subtitle-option form__input-subtitle--grayed'>
                        ( {roundCoords(markerPosition).toString()} )
                    </div>
                )}
            </div>
        </div>
    </>
}

function FieldLocationSearch({ isCustomAddress, placeholder, setResults, hideAddress, onFocus, pickedAddress, isLoading, setIsLoading }) {
    const geoSearch = useGeoSearch()
    const [searching, setIsSearching] = useState(false)
    const [input, setInput] = useState(pickedAddress);


    useEffect(() => {
        setIsLoading(() => searching)
    }, [searching])
    useEffect(() => {
        setInput(() => pickedAddress)
    }, [pickedAddress])
    const searchAddress = (input, limit) => {
        setIsSearching(() => true)
        geoSearch(input, limit, (places) => {
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
                if (value.length > 3) {
                    searchAddress(input, hideAddress)
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
    useEffect(() => {
        setInput(() => pickedAddress)
    }, [pickedAddress])

    const handleFocus = (e) => {
        e.target.select()
    }
    const handleChange = (e) => {
        setPickedAddress(() => e.target.value)
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
                    onClick={() => { setIsCustomAddress(() => false) }}
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
export function SearchResultsList({ results, hideAddress, handleAddressPicked }) {
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
