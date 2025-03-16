import Loading from "components/loading";
import { LoadUserLocationButton } from "elements/DropDownSearchLocation";
import { useGeoSearch } from "elements/Fields/FieldLocation/location.helpers";
import t from "i18n";
import { useEffect, useState } from "react";
import { IoSearchCircleOutline } from "react-icons/io5";
import { alertService } from "services/Alert";

export default function LocationSearchBar({
    placeholder,
    label = null,
    explain = null,
    markerAddress,
    isLoadingExternally,
    hideAddress,
    handleSelectedPlace,
}) {
    const [input, setInput] = useState(markerAddress);
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const handleChange = (value) => {
        setInput(() => value);
        if (value.length > 3) {
            searchAddress(input, hideAddress)
        }
    };
    
    useEffect(() => {
        setIsLoading(() => isLoadingExternally)
    }, [isLoadingExternally])
    useEffect(() => {
        setInput(() => markerAddress)
    }, [markerAddress])
    useEffect(() => {
        if (input.length > 3) {
            searchAddress(input, hideAddress)
        }
    }, [hideAddress])


    useEffect(() => {
        setIsLoading(() => false);
    }, [results])
    const geoSearch = useGeoSearch()

    const searchAddress = (input, limit) => {
        setIsLoading(() => true);
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

    const handleFocus = (event) => event.target.select();
    return <>
        <div className="form__field">
            {label && <div className="form__label">{label}</div>}
            {explain && <div className="form__explain">{explain}</div>}
            <div className="form__field--location">
                <div className="input-wrapper">
                    <IoSearchCircleOutline />
                    <input
                        placeholder={placeholder}
                        value={input}
                        onChange={(e) => handleChange(e.target.value)}
                        onFocus={handleFocus}
                    />
                    {isLoading ?
                        <Loading /> :
                        <>
                            <LoadUserLocationButton handleSelectedPlace={(t) => console.log('TODO!!! loading user location...')} />
                        </>
                    }
                </div>
                {(results && results.length > 0) && <SearchResultsList handleSelectedPlace={handleSelectedPlace} results={results} hideAddress={hideAddress} />}
                {(!results || results.length < 1) && <>No results</>}
                {hideAddress}<br />
            </div>
        </div>
    </>
}

export function SearchResultsList({ results, hideAddress,handleSelectedPlace }) {
    return (

        <div className="results-list">
            {results.map((result, id) => {
                return <SearchResult handleSelectedPlace={handleSelectedPlace} result={result} key={id} />;
            })}
        </div>
    );
};


export function SearchResult({ result,handleSelectedPlace }) {
    return (
        <div 
            className="__search-result"
            onClick={(e) => { handleSelectedPlace(result) }}
        >
            {result.formatted}
        </div>
    );
};
