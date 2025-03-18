import Loading from "components/loading";
import Btn, { BtnType, ContentAlignment, IconType } from "elements/Btn";
import { LoadUserLocationButton } from "elements/DropDownSearchLocation";
import { useGeoSearch } from "elements/Fields/FieldLocation/location.helpers";
import FieldText from "elements/Fields/FieldText";
import t from "i18n";
import { useEffect, useState } from "react";
import { IoCloseOutline, IoSearchCircleOutline } from "react-icons/io5";
import { alertService } from "services/Alert";

export default function LocationSearchBar({
    placeholder,
    label = null,
    explain = null,
    markerAddress,
    hideAddress,
    isCustomAddress,
    setIsCustomAddress,
    setMarkerAddress,
    setMarkerPosition
}) {
    const [input, setInput] = useState(markerAddress);
    const [results, setResults] = useState([]);
    const [showAddCustomButton, toggleShowAddCustomButton] = useState(false)

    const handleChange = (value) => {
        setInput((prevValue) => {
            if (prevValue != value) {
                if (value.length > 3) {
                    searchAddress(input, hideAddress)
                } else {
                    setResults(() => [])
                }
            }
            return value;
        });

    };

    const handleAddressPicked = (place) => {
        setMarkerAddress(place.formatted)
        setMarkerPosition([place.geometry.lat, place.geometry.lng])
        setResults(() => [])
    }

    useEffect(() => {
        if (isCustomAddress) {
            setResults(() => [])
        }
    }, [setIsCustomAddress])

    useEffect(() => {
        setInput(() => markerAddress)
    }, [markerAddress])

    const geoSearch = useGeoSearch()

    const searchAddress = (input, limit) => {
        setResults(() => null)
        geoSearch(input, limit, (places) => {
            if (places.length > 0) {
                const placesFound = places.map((place, key) => {
                    return {
                        ...place,
                        id: key,
                    };
                })
                setResults(() => placesFound);
                return;
            }
            setResults(() => [])
            return;
        }, (error) => {
            alertService.error(t('button.errorAddressFetch'))
            setResults(() => [])
            return;
        });
    };

    const handleFocus = (event) => {
        event.target.select();
        toggleShowAddCustomButton(() => true)
    }
    const handleBlur = () => {
        toggleShowAddCustomButton(() => false)
    }
    return <>
        <div className="form__field form__field--location-wrapper">
            {label && <div className="form__label">{label}</div>}
            {explain && <div className="form__explain">{explain}</div>}
            <div className="form__field-dropdown form__field-dropdown--location">
                <div className="form__field-dropdown--input-location">
                    {!isCustomAddress &&
                        <>
                            {!markerAddress ? <><Loading />...</> :
                                <input
                                    className="form__input"

                                    placeholder={placeholder}
                                    value={input}
                                    onChange={(e) => handleChange(e.target.value)}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                />
                            }
                            {results == null && <><Loading/>...</>}
                        </>
                    }
                    {isCustomAddress &&
                        <><FieldText label={t('button.labelCustomAddress')} name={"customAddress"} onChange={(e) => console.log(e.target.value)} />
                            <Btn
                                btnType={BtnType.circle}
                                iconLink={<IoCloseOutline />}
                                iconLeft={IconType.circle}
                                contentAlignment={ContentAlignment.center}
                                onClick={() => { setIsCustomAddress(() => false) }}
                            />
                        </>
                    }
                    <LoadUserLocationButton handleBrowserLocation={handleAddressPicked} hideAddress={hideAddress} />
                </div>
                {(results && results.length > 0) &&
                    <>
                        <SearchResultsList handleAddressPicked={handleAddressPicked} results={results} hideAddress={hideAddress} />
                    </>
                }
                {showAddCustomButton &&
                    <SearchCustomAddress setIsCustomAddress={setIsCustomAddress} />
                }


            </div>
        </div>
    </>
}

export function SearchCustomAddress({ setIsCustomAddress }) {
    return (<>
        <hr />
        <div
            className="dropdown__dropdown-option"
            onClick={(e) => { setIsCustomAddress(() => true) }}
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
