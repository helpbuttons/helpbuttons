import PickerField from "components/picker/PickerField";
import Btn, { BtnType, ContentAlignment, IconType } from "elements/Btn";
import { LocationCoordinates } from "elements/Fields/FieldLocation";
import LocationSearchBar from "elements/LocationSearchBar";
import t from "i18n";
import { useEffect, useState } from "react";
import { IoLocationOutline, IoTrashBinOutline } from "react-icons/io5";
import { store } from "state";
import { CreateKeyLocation, DeleteKeyLocation, ListKeyLocation } from "state/Geo";
import { useSelectedNetwork } from "state/Networks";
import { LocationKeyIcon } from "../Map/MarkerButton";
import { FieldMapZoomSlide } from "elements/Fields/FieldAreaMap";
import { MapLocationKey } from "../Map/NetworkMapConfigure";
import { useGeoReverse } from "elements/Fields/FieldLocation/location.helpers";
import { alertService } from "services/Alert";

export function FieldKeySpots() {
    const [showPopup, setShowPopup] = useState(false)

    const closePopup = () => setShowPopup(() => false)
    const openPopup = () => setShowPopup(() => true)

    return (<PickerField iconLink={<IoLocationOutline />} showPopup={showPopup} validationError={null} label={t('configuration.locationKeys')} btnLabel={t('configuration.locationKeys')} explain={t('configuration.keyLocationsExplain')} headerText={t('picker.headerText')} openPopup={openPopup} closePopup={closePopup}>
        <div className="location-keys">
            <LocationKeyTable />
        </div>
    </PickerField>

    )

}


export function LocationKeyAdd({ addAction }) {
    const selectedNetwork = useSelectedNetwork()

    const onSave = (place) => {
        addAction(place)
    }
    return <div className="location-keys--form">
        {selectedNetwork?.exploreSettings?.center ?
            <FieldLocationKeyMap
                onSave={onSave}
                selectedNetwork={selectedNetwork}
            />
        : 'Please choose a network location, before adding key spots'}
    </div>
}

export function LocationKeyItem({ place, deleteAction }) {

    return <div>
        <LocationCoordinates latitude={place.latitude} longitude={place.longitude} address={place.address} label={'no'} />
        <Btn
            btnType={BtnType.iconActions}
            iconLink={<IoTrashBinOutline />}
            iconLeft={IconType.circle}
            contentAlignment={ContentAlignment.center}
            onClick={() => {
                deleteAction(place.id)
            }}
        />
    </div>
}


export function LocationKeyTable() {

    const [locations, setLocations] = useState([])
    const reloadLocations = () => {
        store.emit(
            new ListKeyLocation((list) => {
                setLocations(() => list)
            }),
        );
    }
    useEffect(() => {
        reloadLocations()
    }, []);

    const addLocation = (place) => {
        store.emit(new CreateKeyLocation(place, () => {
            alertService.info('Added ' + place.address)
            reloadLocations()
        }))

    }
    const deleteLocation = (id) => {
        store.emit(new DeleteKeyLocation(id))
        setLocations((prevLocations) => prevLocations.filter((place) => place.id != id))
    }
    return (
        <>
            <LocationKeyAdd addAction={addLocation} />
            <div>
                {locations?.length > 0 && (
                    <div>
                        {locations.map((place, idx) =>
                            <LocationKeyItem key={idx} place={place} deleteAction={deleteLocation} />
                        )}
                    </div>
                )}
            </div>
        </>
    )
}

export function FieldLocationKeyMap({
    onSave,
    selectedNetwork,
}) {

    const [isLoading, setIsLoading] = useState(false)

    const [address, setAddress] = useState('')
    const [foundAddress, setFoundAddress] = useState('')
    const [zoom, setZoom] = useState(selectedNetwork.exploreSettings.zoom);
    const [center, setCenter] = useState(selectedNetwork.exploreSettings.center);

    const [isCustomAddress, setIsCustomAddress] = useState(false)

    const resetForm = () => {
        setCenter(() => selectedNetwork.exploreSettings.center)
        setAddress(() => '')
        setZoom(() => selectedNetwork.exploreSettings.zoom)
    }
    const onSaveClicked = () => {
        onSave({ address: address, latitude: center[0], longitude: center[1], zoom: zoom})
        resetForm()
    }
    const onBoundsChange = ({ center, zoom, bounds }) => {
        setZoom(() => Math.round(zoom))
    }
    const onMapClick = ({ latLng }) => {
        findAddressFromPosition(latLng)
        setCenter(() => latLng)
    }

    const getLatLngAddress = useGeoReverse()

    const findAddressFromPosition = (latLng) => {
        setIsLoading(() => true)
        getLatLngAddress(latLng, false, (place) => {
            console.log(place)
            setFoundAddress(() => place.formatted)
            setIsLoading(() => false)
        },
            (error) => {
                setIsLoading(() => false)
                setFoundAddress(() => t('button.unknownPlace'))
            }
        );
    }

    useEffect(() => {
        if (!isCustomAddress) {
            setAddress(() => foundAddress)
        }
    }, [foundAddress])

    return (
        // <PickerField iconLink={<IoLocationOutline />} showPopup={showPopup} btnLabel={t('configuration.addLocationKey')} headerText={t('picker.headerText')} openPopup={openPopup} closePopup={closePopup}>
            <div className="form__field form__field--location-wrapper">
                <LocationSearchBar
                    placeholder={t('button.locationPlaceholder')}
                    pickedAddress={address}
                    hideAddress={true}
                    setPickedAddress={setAddress}
                    isCustomAddress={isCustomAddress}
                    setIsCustomAddress={setIsCustomAddress}
                    setPickedPosition={setCenter}
                    focusPoint={center}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    pickedPosition={center}
                />
                <MapLocationKey 
                    center={center}
                    zoom={zoom}
                    tileType={undefined}
                    onBoundsChanged={onBoundsChange}
                    handleMapClick={onMapClick}
                >
                    <LocationKeyIcon 
                        title={address} anchor={center}
                        offset={[25, 50]}
                        cssColor={'red'}
                    />
                </MapLocationKey>
                <FieldMapZoomSlide zoom={zoom} setZoom={(zoom) => setZoom(() => Math.round(zoom))} />
                <Btn
                    btnType={BtnType.submit}
                    caption={t('common.save')}
                    contentAlignment={ContentAlignment.center}
                    onClick={() => onSaveClicked()}
                />
            </div>

        // </PickerField>
    )
}
