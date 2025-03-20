import Loading from "components/loading";
import Btn, { BtnType, ContentAlignment, IconType } from "elements/Btn";
import { LoadUserLocationButton } from "elements/DropDownSearchLocation";
import { useGeoSearch } from "elements/Fields/FieldLocation/location.helpers";
import FieldText from "elements/Fields/FieldText";
import t from "i18n";
import { useEffect, useState } from "react";
import { IoCloseOutline, IoCopyOutline, IoSearchCircleOutline } from "react-icons/io5";
import { alertService } from "services/Alert";
import { roundCoords } from "shared/honeycomb.utils";

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
    setMarkerPosition
}) {
    const [results, setResults] = useState([]);
    const [showAddCustomButton, toggleShowAddCustomButton] = useState(false)

    const handleAddressPicked = (place) => {
        setMarkerAddress(place.formatted)
        setMarkerPosition([place.geometry.lat, place.geometry.lng])
        setResults(() => [])
    }

    useEffect(() => {
        toggleShowAddCustomButton(() => false)
    }, [markerAddress])

    const handleFocus = (event) => {
        toggleShowAddCustomButton(() => true)
    }

    return <>
        <div className="form__field form__field--location-wrapper">
            {label && <div className="form__label">{label}</div>}
            {explain && <div className="form__explain">{explain}</div>}
            <div className="form__field-dropdown form__field-dropdown--location">
                <div className="form__field-dropdown--input-location">
                    <FieldLocationSearch isCustomAddress={isCustomAddress} markerAddress={markerAddress} placeholder={placeholder} onResults={setResults} onFocus={handleFocus} showLoading={(results == null)} hideAddress={hideAddress} />
                    <FieldCustomAddress isCustomAddress={isCustomAddress} setMarkerAddress={setMarkerAddress} setIsCustomAddress={setIsCustomAddress} markerAddress={markerAddress} />
                    <LoadUserLocationButton handleBrowserLocation={handleAddressPicked} hideAddress={hideAddress} />
                </div>
                {(results && results.length > 0) &&
                    <SearchResultsList handleAddressPicked={handleAddressPicked} results={results} hideAddress={hideAddress} />
                }
                {showAddCustomButton &&
                    <SearchCustomAddress handleClick={() => { console.log('clicked'); setIsCustomAddress(() => true); toggleShowAddCustomButton(() => false) }} />
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

function FieldLocationSearch({ isCustomAddress, markerAddress, placeholder, onResults, hideAddress, showLoading, onFocus }) {
    const geoSearch = useGeoSearch()
    const [input, setInput] = useState(markerAddress);

    useEffect(() => {
        setInput(() => markerAddress)
    }, [markerAddress])
    const searchAddress = (input, limit) => {
        onResults(() => null)
        geoSearch(input, limit, (places) => {
            if (places.length > 0) {
                const placesFound = places.map((place, key) => {
                    return {
                        ...place,
                        id: key,
                    };
                })
                onResults(() => placesFound);
                return;
            }
            onResults(() => [])
            return;
        }, (error) => {
            alertService.error(t('button.errorAddressFetch'))
            onResults(() => [])
            return;
        });
    };
    const handleChange = (value) => {
        setInput((prevValue) => {
            if (prevValue != value) {
                if (value.length > 3) {
                    searchAddress(input, hideAddress)
                } else {
                    onResults(() => [])
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
            {!markerAddress ? 
                <div className="form__input"><Loading /></div> 
            :
                <div className="form__input--dropdown-search">
                <input
                    className="form__input--dropdown-search__input"

                    placeholder={placeholder}
                    value={input}
                    onChange={(e) => handleChange(e.target.value)}
                    onFocus={handleFocus}
                />
                {showLoading && <div className="form__input--location-loading"><Loading /></div>}
                </div> 
            }
            
            
        </>
    }</>

}
function FieldCustomAddress({ isCustomAddress, setMarkerAddress, setIsCustomAddress, markerAddress }) {
    const handleFocus = (e) => {
        e.target.select()
    }
    const handleChange = (e) => {
        setMarkerAddress(e.target.value)
    }
    const [input, setInput] = useState(markerAddress);

    return (<>{isCustomAddress &&
        <>
            <input
                className="form__input"
                placeholder={t('button.placeHodlerCustomAddress')}
                value={input}
                onFocus={handleFocus}
                onChange={handleChange}
            />
            <Btn
                btnType={BtnType.circle}
                iconLink={<IoCloseOutline />}
                iconLeft={IconType.circle}
                contentAlignment={ContentAlignment.center}
                onClick={() => { setIsCustomAddress(() => false) }}
            />
        </>
    }
    </>)
}
export function SearchCustomAddress({ handleClick }) {
    return (<>
        <hr />
        <div
            className="dropdown__dropdown-option"
            onClick={handleClick}
        >
            {t('button.proposeAddress')}
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
